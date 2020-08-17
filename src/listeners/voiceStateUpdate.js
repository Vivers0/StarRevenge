const { Listener } = require('discord-akairo');

class voiceStateUpdate extends Listener {
  constructor() {
    super('voiceStateUpdate', {
      event: 'voiceStateUpdate',
      emitter: 'client',
      category: "client"
    });
  }

  async exec(oldState, newState) {
    if (!newState.channel && oldState.channel) {
      this.client.channels.cache.get(process.env.VOICECOUNTERID).setName(`🌌 В войсе: ${oldState.guild.members.cache.filter(m => m.voice.channelID != null && !m.user.bot).size}`);
    };
    if (!oldState.channel && newState.channel) {
      this.client.channels.cache.get(process.env.VOICECOUNTERID).setName(`🌌 В войсе: ${oldState.guild.members.cache.filter(m => m.voice.channelID != null && !m.user.bot).size}`);
    };
  }
}

module.exports = voiceStateUpdate;
