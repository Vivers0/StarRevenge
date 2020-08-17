const { Listener } = require("discord-akairo");


class Raedy extends Listener {
    constructor () {
        super('ready', {
            event: 'ready',
            emitter: 'client'
        })

        this.acivities_list = ["The Star Revenge", "discord.gg/qhAq3x8"];
    }

    exec() {
        this.getNumber()
        console.log("[StarRevenge] Бот успешно запущен!")
    }

    getNumber() {
        return setInterval(() => {
            let index = Math.floor(Math.random() * this.acivities_list.length);
            this.client.user.setActivity(this.acivities_list[index], { type: "WATCHING" });
          }, 7000);
    }
}

module.exports = Raedy