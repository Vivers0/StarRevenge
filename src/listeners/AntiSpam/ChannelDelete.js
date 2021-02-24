const { Listener } = require("discord-akairo");


class ChannelDelete extends Listener {
    constructor () {
        super('channelDelete', {
            event: 'channelDelete',
            emitter: 'client'
        })
        this.users = {}
    }

    async exec(channel) {
        const { guild } = channel
        const logs = await guild.fetchAuditLogs({ type: 12 })
        if (!logs) return
        const log = logs.entries.find(e => e.target.id === channel.id)
        if (!this.users[log.executor.id]) {
            this.users[log.executor.id] = {
                time: new Array()
            }
        }
        this.users[log.executor.id].time.unshift(log.createdTimestamp) 
        if (this.users[log.executor.id].time.length == 3) {
            if (this.users[log.executor.id].time[0] - this.users[log.executor.id].time[1] < 60000) {
                const usr = await guild.members.fetch(log.executor.id)
                usr.roles.remove(usr.roles.cache.array())
                // guild.owner.send(`Сработала система АнтиСпама и с участника <@${log.executor.id}> были сняты все роли`)
            }
        }
    }  
}

module.exports = ChannelDelete