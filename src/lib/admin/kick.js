const { Command } = require("discord-akairo")
const { MessageEmbed } = require("discord.js")

class Kick extends Command {
    constructor() {
        super('kick', {
            aliases: ["kick"],
            category: "client"
        })
    }

    async exec(message) {
        const args = message.content.slice("!".length).split(/ +/)
        if (!message.member.permissions.has('KICK_MEMBERS')) return message.channel.send('Недостаточно прав!')
        if (!message.guild.me.hasPermission('KICK_MEMBERS')) return message.channel.send('Недостаточно прав!')
        const member = message.guild.member(message.mentions.users.first() || await message.guild.members.fetch(args[1]))
        const reason = args[2] || 'Не указано'

        if (member) {
            if (member.id === message.author.id) return message.channel.send('Вы не можете забанить самого себя!')
            member.kick(reason)
            .then(() => {
            const msg = new MessageEmbed()
              .setColor('RED')
              .setAuthor('Пользователь выгнан!', 'https://imgur.com/DPXrCB7.png')
              .setThumbnail(member.user.avatarURL())
              .addField('Участник:', member.user.tag, true)
              .addField('Модератор:', `<@${message.author.id}>`, true)
              .addField('ID', member.id, true)
              .addField('Причина', reason, true)
              .setTimestamp()

              message.channel.send(msg).then(msg => msg.delete({ timeout: 10000 }))
              this.client.channels.cache.get(process.env.GET).send(msg)
            })
        }
    }
}

module.exports = Kick