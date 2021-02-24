const VKIO = require("vk-io");

const Sender = require("./Sender");

const { VK } = VKIO;
const { resolveResource } = VKIO;

function getResourceId(api, resource) {
    return resolveResource({
        api,
        resource
    })
        .then(({ id, type }) =>
            type === "user" ?
                id
                :
                type === "group" ?
                    -id
                    :
                    null
        )
        .catch(() => null);
}

function getPostLink({ owner_id, id }) {
    return `https://vk.com/wall${owner_id}_${id}`;
}

function getPostAuthor(post, profiles, groups) {
    const [profile] = (
        post.from_id > 0 ?
            profiles.filter(({ id }) => id === post.from_id)
            :
            groups.filter(({ id }) => id === Math.abs(post.from_id))
    )
        .map((profile) => {

            const { name, photo_50, first_name, last_name } = profile;

            if (name) {
                return profile;
            } else {
                return {
                    name: `${first_name} ${last_name}`,
                    photo_50
                }
            }
        });

    return profile;
}

function getById(api, id) {
    return id ?
        id > 0 ?
            api.users.get({
                user_ids: id,
                fields: "photo_50"
            })
                .then(([{ first_name, last_name, ...user }]) => ({
                    name: `${first_name} ${last_name}`,
                    ...user
                }))
            :
            api.groups.getById({
                group_id: Math.abs(id)
            })
                .then(([group]) => group)
        :
        null;
}


 class Handler {

    constructor(cluster) {
        this.cluster = cluster;
    }

    init() {
        const { vk } = this.cluster;
        const { longpoll, token } = vk;

        this.VK = new VK({
            token,
            apiMode: "parallel"
        });

        if (!longpoll) {
            this.startInterval();
        } else {
            this.startPolling();
        }
    }

    startInterval() {
        const { vk, discord, index } = this.cluster;
        const { interval, group_id, filter } = vk;
        const { author, copyright } = discord;

        console.log(`[VK2Discord] Кластер #${index} будет проверять новые записи с интервалом в ${interval} секунд.`);

        if (interval < 30) {
            console.warn("[!] Не рекомендуем ставить интервал получения постов меньше 30 секунд, во избежания лимитов ВКонтакте!");
        }

        setInterval(async () => {
            const sender = this.createSender();

            const id = await getResourceId(this.VK.api, group_id);

            if (!id) {
                return console.error(`[!] ${group_id} не является ID-пользователя или группы ВКонтакте!`)
            }

            const [builder] = sender.builders;

            this.VK.api.wall.get({
                owner_id: id,
                count: 2,
                extended: 1,
                filter: filter ? "owner" : "all",
                v: "5.126"
            })
                .then(async ({ groups, profiles, items }) => {
                    if (items.length) {
                        const post = items.length === 2 ? items[0].date > items[1].date ? items[0] : items[1] : items[0]; // Проверяем наличие закрепа, если он есть берем свежую запись

                        if (author) {
                            const { name, photo_50 } = getPostAuthor(post, profiles, groups);

                            // builder.setAuthor(name, photo_50, getPostLink(post));
                        }

                        if (copyright) {
                            await this.setCopyright(post, builder);
                        }

                        return sender.handle(post);
                    } else {
                        console.log("[!] Не получено ни одной записи. Проверьте наличие записей в группе или измените значение фильтра в конфигурации.");
                    }

                })
                .catch(console.log);
        }, interval * 1000);
    }

    async startPolling() {
        const { index, discord: { author, copyright } } = this.cluster;

        this.VK.updates.on("wall_post_new", async ({ payload }) => {
            if (payload.post_type === "post") {
                const sender = this.createSender();

                const [builder] = sender.builders;

                if (author) {
                    const { photo_50, name } = await getById(this.VK.api, payload.from_id);

                    // builder.setAuthor(name, photo_50, getPostLink(payload));
                }

                if (copyright) {
                    await this.setCopyright(payload, builder);
                }

                return sender.handle(payload);
            }
        });

        this.VK.updates.start()
            .then(() =>
                console.log(`[VK2Discord] Кластер #${index} подключен к ВКонтакте с использованием LongPoll!`)
            )
            .catch(console.error);
    }

    createSender() {
        const cluster = this.cluster;
        const VK = this.VK;

        return new Sender({
            ...cluster,
            VK
        });
    }

    async setCopyright({ copyright }, builder) {
        if (copyright) {
            const group = await getById(this.VK.api, copyright.id);

            builder.setFooter(`Источник: ${copyright.name}`, group && group.photo_50); // Вскоре заменить на nullable оператор, при этом теряя поддержку node < 14
        }
    }
}

module.exports =  Handler