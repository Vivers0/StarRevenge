const { Command } = require("discord-akairo")

class Clear extends Command {
    constructor() {
        super('clear', {
            aliases: ["clear"],
            category: "client"
        })
    }

    async exec(message) {
        const [_, ...args] = message.content.slice("!".length).split(/ +/)
        if (!message.guild.me.hasPermission('MANAGE_MESSAGES')) return message.channel.send('Недостаточно прав!')
        if (!message.member.permissions.has('MANAGE_MESSAGES')) return message.channel.send('Недостаточно прав!')

        if (isNaN(args[0]) || parseInt(args[0]) <= 0) return message.channel.send('Вы ввели не число.').then(m => m.delete({ timeout: 10000 }))
        let deleteNum
        if (parseInt(args[0]) > 100) {
          deleteNum = 100
        } else {
          deleteNum = parseInt(args[0])
        }

        message.channel.bulkDelete(deleteNum)
    }
}

module.exports = Clear