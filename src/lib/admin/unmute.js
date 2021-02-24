const { Command } = require("discord-akairo")
const { MessageEmbed } = require("discord.js")

class Unmute extends Command {
    constructor() {
        super('unmute', {
            aliases: ["unmute"],
            category: "client"
        })
    }

    async exec(message) {
        const args = message.content.slice("!".length).split(/ +/)
        let rUser = message.guild.member(message.mentions.users.first() || await message.guild.members.fetch(args[1]));
        let role = message.guild.roles.cache.find(r => r.id === process.env.MUTEROLE);
    
        rUser.roles.remove(role).then(() => {
            let msg = new MessageEmbed()
            .setDescription(`Участник <@${rUser.id}> размучен!`)
            .addField('Модератор', `<@${message.author.id}>`, true);
            
            message.channel.send(msg).then(msg => msg.delete({ timeout: 10000 }))
            this.client.channels.cache.get(process.env.GET).send(msg)
        })

    }
}

module.exports = Unmute