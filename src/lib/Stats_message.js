const { Command } = require("discord-akairo")
const { MessageEmbed } = require("discord.js")
const { query } = require('gamedig')

class Parser extends Command {
    constructor() {
        super('parser', {
            aliases: ["server"],
            category: "client"
        })
        this.message = message
    }
    
    async exec(message) {
        message.channel.bulkDelete(1);
        let { name, map, game, raw, connect } = await query({ type: 'garrysmod', port: 27015, host: '95.181.153.217' })
        let embed = new MessageEmbed()
            .setThumbnail("https://i.imgur.com/K2EEwXo.png")
            .setAuthor("Информация о сервере\n"+connect)
            .setDescription("[Быстрое подключение](https://senko.space/redirect?r=thestarrevenge.senko.network)")
            .addField("Название", name, false)
            .addField("Карта", map, false)
            .addField("Режим", raw.game, false)
            .addField('Онлайн', raw.numplayers, false)
            .setFooter("© «STAR WARS™: The Star Revenge». 2020 год.", "https://i.imgur.com/K2EEwXo.png")
            .setColor("BLUE")
        message.channel.send(embed).then(msg => msg.delete({ timeout: 10000 }))
    }
} 

module.exports = Parser