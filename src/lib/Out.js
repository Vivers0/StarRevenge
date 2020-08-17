const { Command } = require("discord-akairo")
const { MessageEmbed } = require("discord.js")

class Out extends Command {
    constructor() {
        super('out', {
            aliases: ["out"],
            category: "client"
        })
    }

    async exec(message) {
        if (message.channel.id !== process.env.GET) return;
        try {
        await message.guild.member(message.author).roles.remove(message.guild.member(message.author).roles.cache.array())
        await message.guild.member(message.author).roles.add(["655467785605873731"]);
        } catch(e) {
            console.log(e)
        }
        message.channel.bulkDelete(1);
        message.channel.send(new MessageEmbed().setDescription(`<@${message.author.id}> Успешно! С вас сняты все роли!`).setColor("#FFA500").setFooter("The Star Revenge").setTimestamp()).then(msg => msg.delete({ timeout: 10000 }));
        this.client.channels.cache.find(c => c.id === process.env.SET).send(new MessageEmbed().setDescription(`С <@${message.author.id}> сняты все роли!`).setColor("#FFA500").setFooter("The Star Revenge").setTimestamp());
    }
}

module.exports = Out