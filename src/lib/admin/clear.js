const { Command } = require("discord-akairo")
const { MessageEmbed } = require("discord.js")

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

        
        const user = message.mentions.users.first()
        const amount = parseInt(args[0])

        let embed = new MessageEmbed()
            .setColor('GREEN')
            .addField(`Удалено:`, `**${amount}** сообщений;`)
        await message.channel.messages
            .fetch({
                limit: 100,
            })
            .then((messages, messageToDelete) => {
                messageToDelete = messages.array().slice(0, amount)
                if (message.content.includes('--bots')) {
                    messageToDelete = messages
                        .filter((m) => m.author.bot === true)
                        .array()
                        .slice(0, amount);
                    embed.addField(`Фильтр пользователя:`, 'Только боты')
                }
                if (user) {
                    const filterBy = user ? user.id : bot.user.id
                    messageToDelete = messages
                        .filter((m) => m.author.id === filterBy)
                        .array()
                        .slice(0, amount);
                    embed.addField(`Фильтр пользователя:`, user.tag)
                }
                message.channel.bulkDelete(messageToDelete).catch((error) => console.log(error.stack))
            })
        await message.channel.send(embed)
    }
}

module.exports = Clear