const { Command } = require("discord-akairo")
const { MessageEmbed } = require("discord.js")
const Warn = require("../../mongo/Warn")

class Ban extends Command {
    constructor() {
        super('ban', {
            aliases: ["ban"],
            category: "client"
        })
    }

    async exec(message) {
      const [_, ...args] = message.content.slice("!".length).split(/ +/)
      if (!message.guild.me.hasPermission('BAN_MEMBERS')) return message.channel.send('Недостаточно прав!')
      if (!message.member.permissions.has('BAN_MEMBERS')) return message.channel.send('Недостаточно прав!')

      const member = message.guild.member(message.mentions.users.first())
      if (!member) return message.channel.send('Вы не указали участника!')
      

      const reason = args[1]
      if (member.id === message.author.id) return message.channel.send('Вы не можете забанить самого себя!')

    member
      .ban({ reason })
      .then(() => {
        const msg = new MessageEmbed()
          .setColor('RED')
          .setAuthor('Пользователь забанен!', 'https://imgur.com/BpSe1kX.png')
          .setThumbnail(member.avatarURL)
          .addField('Участник:', user.tag, true)
          .addField('ID', member.id, true)
          .setTimestamp()
        if (reason) msg.addField('Причина:', reason, true)
        message.channel.send(msg).then(msg => msg.delete({ timeout: 10000 }))
        this.client.channels.cache.get(process.env.GET).send(msg)
      })
    }
}

module.exports = Ban