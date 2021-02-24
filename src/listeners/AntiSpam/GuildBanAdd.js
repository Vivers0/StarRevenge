const { Listener } = require("discord-akairo");


class GuildBanAdd extends Listener {
    constructor () {
        super('guildBanAdd', {
            event: 'guildBanAdd',
            emitter: 'client'
        })
        this.users = {}
    }

    async exec(guild, user) {
        const logs = await guild.fetchAuditLogs({ type: 22 })
        if (!logs) return
        const log = logs.entries.find(e => e.target.id === user.id)
        if (!this.users[log.executor.id]) {
            this.users[log.executor.id] = {
                time: new Array(),
                count: new Number()
            }
        }
        this.users[log.executor.id].time.unshift(log.createdTimestamp) 
        this.users[log.executor.id].count++
        if (this.users[log.executor.id].time.length == 3) {
            if (this.users[log.executor.id].time[0] - this.users[log.executor.id].time[1] < 60000) {
                const usr = await guild.members.fetch(log.executor.id)
                usr.roles.remove(usr.roles.cache.array())
                guild.owner.send(`Сработала система АнтиСпама и с участника <@${log.executor.id}> были сняты все роли`)
            }
        }
    }  
}

module.exports = GuildBanAdd