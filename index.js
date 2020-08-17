require("dotenv").config()
const { AkairoClient, CommandHandler, ListenerHandler } = require("discord-akairo")

class StarRevenge extends AkairoClient {
    constructor() {
        super({
            ownerID: "475259737613795328"
        })

        this.commandHandler = new CommandHandler(this, {
            directory: "./src/lib/",
            prefix: "!"
        })

        this.listenerHandler = new ListenerHandler(this, {
            directory: "./src/listeners/"
        })
    }

    start(token) {
        this.commandHandler.loadAll()
        this.listenerHandler.loadAll()
        this.login(token)
    }
}

const client = new StarRevenge()
client.start(process.env.TOKEN)

// VK

// const { Handler } = require("./src/vk/modules/handler");
// 
// const config = require("./src/vk/config.json");
// 
// const { clusters } = config;
// 
// console.log("[VK2DISCORD] Запущен.");
// 
// clusters.forEach((cluster, index) => {
    // const handler = new Handler();
// 
    // handler.setCluster({
        // ...cluster,
        // index: index + 1
    // });
// 
    // handler.init();
// });
