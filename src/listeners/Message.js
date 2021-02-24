const { Listener } = require("discord-akairo");


class Message extends Listener {
    constructor () {
        super('message', {
            event: 'message',
            emitter: 'client'
        })
        this.aid = new Number()
       
    }

    async exec(message) {
        this.deleteMessageInGetChannel(this.client, message)
        this.createUserModels(message)
    }

    deleteMessageInGetChannel(client, message) {
        if (message.channel.id !== process.env.SET) return;
        if (message.author.id !== client.user.id) message.delete({ timeout: 60000 })    
    }

    async createUserModels(message) {
        this.aid = message.author.id
        if (message.author.bot) return;
        await UserModels.findOne({ userID: message.author.id }, (err, user) => {
            if (err) console.error(err);
            
            if(!user) {
                const newUser = new UserModels({ userID: this.aid, })
                return newUser.save()
            }
        });
    }
}

module.exports = Message