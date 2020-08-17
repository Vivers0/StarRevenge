const { Listener } = require("discord-akairo");


class GuildMemberRemove extends Listener {
    constructor () {
        super('guildMemberRemove', {
            event: 'guildMemberRemove',
            emitter: 'client'
        })
    }

    exec(member) {
        if (member.guild.id !== process.env.GUILDID) return;
        this.client.channels.cache.get(process.env.GUILDMEMBERCHANNELID).setName(`🌃 Игроки: ${member.guild.members.cache.filter(m => !m.user.bot).size}`);
    }
}

module.exports = GuildMemberRemove