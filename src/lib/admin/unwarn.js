const { Command } = require("discord-akairo");
const { MessageEmbed } = require("discord.js");

class Unwarn extends Command {
    constructor() {
        super('warnremove', {
            aliases: ["warnremove", 'warnrem', 'wrem'],
            category: "client"
        })
        this.aid;
    }

    async exec(message) {
        let member = message.guild.member(message.mentions.users.first())
        if (member) {
            await WarnModels.deleteMany({ userID: member.id })
            let userModel = await UserModels.findOne({ userID: member.id })
            userModel.warn = 0
            userModel.save()
            this.sendMessage(message, 'deleteMany', member)
        } else {
        const [_, ...args] = message.content.slice("!".length).split(/ +/)

        if(!message.member.hasPermission("KICK_MEMBERS")) return message.channel.send(`У вас нету прав!`)

        await WarnModels.findOne({ warnID: args[0] }).exec((err, res) => {
            if (!res) {
                return message.channel.send('Предупреждения с таким ID не найдено!')
            } else {
                this.aid = res
            }
        })
        await WarnModels.deleteOne({ warnID: args[0] })
        let userModel = await UserModels.findOne({ userID: this.aid.userID })
        userModel.warn -= 1
        userModel.save()
        this.sendMessage(message, 'deleteOne') 
        }   
    }

    sendMessage(message, type, member) {
        
        switch (type) {
            case 'deleteMany':
            let embed = new MessageEmbed()
                .setDescription(`С участника <@${member.id}> были сняты все предупреждения (Модератор: <@${message.author.id}>)`)
                .setColor('GREEN')
                .setTimestamp();

            message.channel.send(embed)
            this.client.channels.cache.get(process.env.GET).send(embed)
            break;
            case 'deleteOne':
                let msg = new MessageEmbed()
                    .setDescription(`Предупреждение с ID **${this.aid.warnID}** успешно удалено (Модератор: <@${message.author.id}>)`)
                    .setColor('GREEN')
                    .setTimestamp();

                message.channel.send(msg)
                this.client.channels.cache.get(process.env.GET).send(msg)
            break;
        }
    }
}

module.exports = Unwarn