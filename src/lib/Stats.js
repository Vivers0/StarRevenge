const { Command } = require("discord-akairo")
const { MessageEmbed } = require("discord.js");
const { query } = require('gamedig')

class Stats extends Command {
    constructor() {
        super('stats', {
            aliases: ["setstats"]
        });
    }

    async exec(message) {
        if (message.author.id !== '475259737613795328') return;
        let { map, raw, connect } = await query({ type: 'garrysmod', port: 27015, host: '95.181.153.217' })
        const embed = new MessageEmbed()
                .setColor('#0099ff')
                .setDescription(`IP: ${connect}\n\n[Быстрое подключение](https://senko.space/redirect?r=thestarrevenge.senko.network)`)
                .addField('Online', raw.numplayers + ' / 80')
                .addField('Map', map)
        message.channel.send(embed).then(msg => {
            setInterval(async () => {
                let { map, raw, connect } = await query({ type: 'garrysmod', port: 27015, host: '95.181.153.217' })
                const embed = new MessageEmbed()
                    .setColor('#0099ff')
                    .setDescription(`IP: ${connect}\n\n[Быстрое подключение](https://senko.space/redirect?r=thestarrevenge.senko.network)`)
                    .addField('Online', raw.numplayers + ' / 80')
                    .addField('Map', map)
                msg.edit(embed)
            }, 30000)
        })
    }
}

module.exports = Stats;