const { Command } = require("discord-akairo")
const { MessageEmbed } = require("discord.js")
const ms = require('ms')

class Mute extends Command {
    constructor() {
        super('mute', {
            aliases: ["mute"],
            category: "client"
        })
    }

    async exec(message) {
        const [_, ...args] = message.content.slice("!".length).split(/ +/)
        if (!message.guild.me.hasPermission('KICK_MEMBERS')) return message.channel.send('Недостаточно прав!')
        if (!message.member.permissions.has('KICK_MEMBERS')) return message.channel.send('Недостаточно прав!')

        const rUser = message.mentions.members.first()
        if (rUser) {
            const reason = args[2]
            const muteTime = ms(args[1])
            if (isNaN(muteTime) || !muteTime) return message.channel.send('Вы ввели время не в том формате')

            if (rUser.id === message.author.id) return message.channel.send('Вы не можете забанить самого себя!')

            let role = message.guild.roles.cache.find((r) => r.id === process.env.MUTEROLE)

            if (!role) return message.channel.send('Не найдена роль для мута!')

        rUser.roles.add(role).then(() => {
          const msg = new MessageEmbed()
            .setColor('RED')
            .setAuthor('Пользователь заглушен!', 'https://imgur.com/DPXrCB7.png')
            .setThumbnail(rUser.avatarURL)
            .addField('Участник:', rUser, true)
            .addField('Модератор:', `<@${message.author.id}>`, true)
            .addField('ID', rUser.id, true)
            .setTimestamp()

          if (reason) msg.addField('Причина:', reason, true)
          this.client.channels.cache.get(process.env.GET).send(msg)
          message.channel.send(msg).then(msg => {
            msg.delete({ timeout: 10000 })
            setInterval(() => {
              rUser.roles.remove(role)
            }, muteTime)
          })
        })
    }
    }
}

module.exports = Mute