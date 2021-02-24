const { Command } = require("discord-akairo")
const { MessageEmbed } = require("discord.js")

class Ban extends Command {
    constructor() {
        super('ban', {
            aliases: ["ban"],
            category: "client"
        })
    }

    async exec(message) {
      const args = message.content.slice("!".length).split(/ +/)
      if (!message.guild.me.hasPermission('BAN_MEMBERS')) return message.channel.send('Недостаточно прав!')
      if (!message.member.permissions.has('BAN_MEMBERS')) return message.channel.send('Недостаточно прав!')
      const member = message.guild.member(message.mentions.users.first()) || await message.guild.members.fetch(args[1])
      if (!member) return message.channel.send('Вы не указали участника!')
      if (member.id === message.author.id) return message.channel.send('Вы не можете забанить самого себя!')
      const reason = args[2] || 'Не указано'

      member.ban({ reason })
        .then(() => {
          const msg = new MessageEmbed()
            .setColor('RED')
            .setAuthor('Пользователь забанен!', 'https://imgur.com/BpSe1kX.png')
            .setThumbnail(member.user.avatarURL())
            .addField('Участник:', member.user.tag, true)
            .addField('Модератор:', `<@${message.author.id}>`, true)
            .addField('ID', member.id, true)
            .addField('Причина:', reason, true)
            .setTimestamp()
          message.channel.send(msg).then(msg => msg.delete({ timeout: 10000 }))
          this.client.channels.cache.get(process.env.GET).send(msg)
      })
    }
}

module.exports = Ban