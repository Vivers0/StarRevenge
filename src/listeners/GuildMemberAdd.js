const { Listener } = require("discord-akairo");


class GuildMemberAdd extends Listener {
    constructor () {
        super('guildMemberAdd', {
            event: 'guildMemberAdd',
            emitter: 'client'
        })
    }

    exec(member) {
        if (member.guild.id !== process.env.GUILDID) return;
        this.client.channels.cache.get(process.env.GUILDMEMBERCHANNELID).setName(`🌃 Игроки: ${member.guild.members.cache.filter(m => !m.user.bot).size}`);
        this.createUserModels(member)
    }

    async createUserModels(member) {
        await UserModels.findOne({ userID: member.id })
        console.log(member.id)
        if (!user) {
            await UserModels.create({ userID: member.id }).then(m => m.save())
        } else return;
    }
}

module.exports = GuildMemberAdd