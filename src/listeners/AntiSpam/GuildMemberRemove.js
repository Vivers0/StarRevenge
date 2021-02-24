const { Listener } = require("discord-akairo");


class GuildMemberRemove extends Listener {
    constructor () {
        super('guildMemberRemove', {
            event: 'guildMemberRemove',
            emitter: 'client'
        })
    }

    async exec(member) {
        const { guild } = member
        const logs = await guild.fetchAuditLogs({ limit: 1, type: 'MEMBER_KICK', });
        if (!logs) return
        const log = logs.entries.find(e => e.target.id === member.id)
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
                guild.owner.send(`Сработала система АнтиСпама и с участника <@${log.executor.id}> были сняты все роли`)
            }
        }  
        this.client.channels.cache.get(process.env.GUILDMEMBERCHANNELID).setName(`🌃 Игроки: ${member.guild.members.cache.filter(m => !m.user.bot).size}`);
    }
}

module.exports = GuildMemberRemove