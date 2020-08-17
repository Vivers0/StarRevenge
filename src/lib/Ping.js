const { Command } = require("discord-akairo")

class Ping extends Command {
    constructor() {
        super('ping', {
            aliases: ["ping"]
        });
    }

    exec(message) {
        message.channel.send("Pong!")

        setInterval(() => {
            const members = message.guild.members.cache.filter(m => !m.user.bot).array();
            const role = ["655467785605873731"];
    
            for (let i = 0; i < members.length; i++) {
                const member = members[i];
                if (message.guild.member(message.author).roles.cache.array() === []) member.roles.add(role).catch(err => console.log(err));
            }
        }, 5000)
    }
}

module.exports = Ping;