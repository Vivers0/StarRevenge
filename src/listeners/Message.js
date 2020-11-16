const { Listener } = require("discord-akairo");


class Message extends Listener {
    constructor () {
        super('message', {
            event: 'message',
            emitter: 'client'
        })

       
    }

    exec(message) {
        this.deleteMessageInGetChannel(this.client, message)
        this.createUserModels(message)
    }

    deleteMessageInGetChannel(client, message) {
        if (message.channel.id !== process.env.SET) return;
        if (message.author.id !== client.user.id) message.delete({ timeout: 60000 })    
    }

    async createUserModels(message) {
        if (message.author.bot) return;
        let user = await UserModels.findOne({ userID: message.author.id });
        if(!user) {
            UserModels.create({ userID: message.author.id })
         } else return;
    }
}

module.exports = Message