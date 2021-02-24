const { Command } = require("discord-akairo");
const { MessageEmbed } = require("discord.js")

class Foreach extends Command {
    constructor() {
        super('foreach', {
            aliases: ["foreach"],
            category: "client"
        })
    }

    async exec(message) {
        // for (let i = 0; i < message.guild.members.length; i++) {
            console.log(message.guild.members)
        // }
        // message.guild.members.guild.members.cache.forEach(member => UserModels.create({ userID: member.user.id })); 
    }
}

module.exports = Foreach