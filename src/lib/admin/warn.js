const { Command } = require("discord-akairo")
const { MessageEmbed } = require("discord.js")

class Warn extends Command {
    constructor() {
        super('warn', {
            aliases: ["warn"],
            category: "client"
        })
        this.aid;
    }

    async exec(message) {
        const [_, ...args] = message.content.slice("!".length).split(/ +/)
        const member = message.guild.member(message.mentions.users.first())
        let reason = args[1];
        if(!reason) reason = 'Отсуствует'

        if(!message.member.hasPermission("KICK_MEMBERS")) return message.channel.send(`У вас нету прав!`)
        if(!member) return message.reply(`Пользователь не найден.`)

        if(member.user.id == message.author.id) return message.reply(`Вы не можете предупредить самого себя`)
        if(member.user.bot) return message.reply(`Боты не по моей части`)

        let user_db = await UserModels.findOne({ userID: member.id });

        this.aid = message.author.id
        user_db.warn++
        let msg = new MessageEmbed()
        .setDescription(`<@${member.id}> получил предупреждение!`)
        .addField('Модератор', `<@${this.aid}>`)
        .addField('Предупреждений', `${user_db.warn}/6`)
        .addField('Причина', reason)
        .setColor('ORANGE');
        member.send(msg)
        this.client.channels.cache.get(process.env.GET).send(msg)
        message.channel.send(msg)
        console.log(this.aid)
            
        WarnModels.create({
            warnID: this.getRandomInt(1, 99999),
            userID: member.id,
            reason,
            moderatorID: message.author.id,
        }).then(m => m.save())

        if (user_db.warn >= 6) {
            member.ban({ reason: "Учасник достиг лимита предупреждений", days: 6 }).then(() => {
                message.channel.send(`<@${member.user.id}> был забанен на 6 дней за большое кол-во предупреждений`)
                user_db.warn = 0;
            })
            member.send(`<@${member.user.id}> был забанен на 6 дней за большое кол-во предупреждений`)
        }
        user_db.save()    
    }

    getRandomInt(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
}

module.exports = Warn