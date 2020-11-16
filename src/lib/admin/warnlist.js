const { Command } = require("discord-akairo")
const { MessageEmbed } = require("discord.js")
const ms = require("ms")

class WarnList extends Command {
    constructor() {
        super('warnlist', {
            aliases: ["warnlist", 'warnl'],
            category: "client"
        })
    }

    async exec(message) {
      if (!message.guild.me.hasPermission('BAN_MEMBERS')) return message.channel.send('Недостаточно прав!')
      if (!message.member.permissions.has('BAN_MEMBERS')) return message.channel.send('Недостаточно прав!')

      const member = message.guild.member(message.mentions.users.first())
      if (!member) return message.channel.send('Вы не указали участника!')
      if(member.user.bot) return message.reply(`Боты не по моей части`)
      
      WarnModels.find({ userID: member.id }).exec((err, res) => {
        let embed = new MessageEmbed().setColor('BLUE').setDescription(`Предупреждения пользователя <@${member.id}>\n---`)
        if(res.length === 0) {
          return message.channel.send('У пользователя нет ни одного предупреждения!')
        } else {
          for (let i = 0; i<res.length; i++) {
            embed.addField(`[${i+1}] ⏰ ${new Date(res[i].time).toLocaleString()}`, `ID Предупреждения - **${res[i].warnID}**\nМодератор: <@${res[i].moderatorID}>\nПричина: **${res[i].reason}**\n_______________`)
          }
        }
        message.channel.send(embed)
    })
  }
}

module.exports = WarnList

