const axios = require("axios")
const jsdom = require("jsdom");
const { Command } = require("discord-akairo")
const { MessageEmbed } = require("discord.js")
const { JSDOM } = jsdom;

class Parser extends Command {
    constructor(message) {
        super('parser', {
            aliases: ["server"],
            category: "client"
        })

        this.link = "https://www.gs4u.net/ru/all/search/name-star+revenge/"
        this.message = message
    }
    
    async exec(message) {
        message.channel.bulkDelete(1);
        this.main().then(obj => {
            let map = obj.map
            let players = obj.players
            let embed = new MessageEmbed()
                .setThumbnail("https://i.imgur.com/K2EEwXo.png")
                .setAuthor("Информация о сервере\n95.181.153.217:27015")
                .setDescription("[Быстрое подключение](https://senko.space/redirect?r=thestarrevenge.senko.network)")
                .addField("Название", "[RU] The Star Revenge | Ренессанс", false)
                .addField("Карта", map, false)
                .addField("Режим", "starwarsrp", false)
                .addField('Онлайн', players, false)
                .setFooter("© «STAR WARS™: The Star Revenge». 2020 год.", "https://i.imgur.com/K2EEwXo.png")
                .setColor("BLUE")

            message.channel.send(embed).then(msg => msg.delete({ timeout: 10000 }))
        })
    }

    main() {
        return new Promise(async (resolve, reject) => {
            try {
            let request = await axios({
                url: this.link
            })
            let obj = new Object()

            let result = request.data
            let { document } = (new JSDOM(result)).window;

            obj.map = document.querySelector("#content > div.blog > div > div > table > tbody > tr > td.mapname > a").textContent
            obj.players = document.querySelector("#content > div.blog > div > div > table > tbody > tr > td.players").textContent
            resolve(obj)
            } catch(err) {
                reject(err)
            }
        })
    }
} 

module.exports = Parser