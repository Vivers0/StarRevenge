const { Command } = require("discord-akairo")
const { MessageEmbed } = require("discord.js")

class Unban extends Command {
    constructor() {
        super('unban', {
            aliases: ["unban"],
            category: "client"
        })
    }

    async exec(message) {
        const [_, ...args] = message.content.slice("!".length).split(/ +/)
        if (!message.member.hasPermission('BAN_MEMBERS')) return message.channel.send("Ошибка! У вас нет прав!");
        if (!args[0]) return message.channel.send('Участник не найден!');

    message.guild.members
    .unban(args[0])
    .then(() => {
        let msg = new MessageEmbed()
        .setDescription(`<@${args[0]}> был успешно разбанен! (Модератор: <@${message.author.id}>)`)
        .setColor('GREEN')
        
        message.channel.send(msg).then(msg => msg.delete({ timeout: 10000 }))
        this.client.channels.cache.get(process.env.GET).send(msg)        
        })
    }
}

module.exports = Unban