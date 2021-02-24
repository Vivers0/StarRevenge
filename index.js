require("dotenv").config()
const { AkairoClient, CommandHandler, ListenerHandler } = require("discord-akairo")

global.mongoose = require('mongoose')
global.UserModels = require("./src/mongo/User")
global.WarnModels = require('./src/mongo/Warn')
mongoose.connect('mongodb+srv://vivers:savva2004@cluster0.aix5n.mongodb.net/starrevenge', { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.connection.on('connected',()=>{
  console.log('[✅ DataBase] Connected!')
})

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

const Handler = require("./src/vk/modules/Handler");

const config = require("./src/vk/config.json");

const { clusters } = config;

console.log("[VK2Discord] Запущен.");

clusters.forEach((cluster, index) =>
    new Handler({
        ...cluster,
        index: index + 1
    })
        .init()
);
