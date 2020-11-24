const { Command } = require("discord-akairo")
const { MessageEmbed } = require("discord.js")

class Help extends Command {
    constructor() {
        super('help', {
            aliases: ["help"],
            category: "client"
        })
    }

    async exec(message) {
            const embed = new MessageEmbed()
                .setAuthor('Команды:')
                .addField('Admin', '**Warn**:\n**!warn [@участник или ID] [причина]** - Предупредить участника\n**!warnlist [@участник или ID]** - Список предупреждений пользователя\n**!warnrem [№ или @участник]** - удалить предупреждение(я)\n\n**!ban [@участник] [причина]** - забанить участника\n**!kick [@участник]** - кикнуть участника\n**!clear [кол-во]** - очистка сообщений\n\n**!unban [ID]** - разбанить участника\n**!unmute [@участник или ID]** - размутить участника')
                .setColor("BLUE")
        message.channel.send(embed)
    }
}

module.exports = Help