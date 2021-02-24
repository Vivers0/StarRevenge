const { Command } = require("discord-akairo")
const { MessageEmbed } = require("discord.js")
const Warn = require("../../mongo/Warn")

class Timeban extends Command {
    constructor() {
        super('timeban', {
            aliases: ["tban"],
            category: "client"
        })
    }

    async exec(message) {
      const args = message.content.slice("!".length).split(/ +/)
      if (!message.guild.me.hasPermission('BAN_MEMBERS')) return message.channel.send('Недостаточно прав!')
      if (!message.member.permissions.has('BAN_MEMBERS')) return message.channel.send('Недостаточно прав!')

      const member = message.guild.member(message.mentions.users.first() || message.guild.members.cache.get(args[1]))
      if (!member) return message.channel.send('Вы не указали участника!')
      
      const days = args[2]
      if(isNaN(days)) return;
      const reason = args[3]
      if (member.id === message.author.id) return message.channel.send('Вы не можете забанить самого себя!')

    member
      .ban({ days, reason })
      .then(() => {
        const msg = new MessageEmbed()
          .setColor('RED')
          .setAuthor('Пользователь забанен!', 'https://imgur.com/BpSe1kX.png')
          .setThumbnail(member.avatarURL)
          .addField('Участник:', user.tag, true)
          .addField('ID', member.id, true)
          .addField('Причина', args[3], true)
          .addField('Кол-во дней', args[2], true)
          .setTimestamp()

        message.channel.send(msg).then(msg => msg.delete({ timeout: 10000 }))
        this.client.channels.cache.get(process.env.GET).send(msg)
      })
    }
}

module.exports = Timeban