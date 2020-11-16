const { Command } = require("discord-akairo");
const { MessageEmbed } = require("discord.js");
const listOfRoles = require("../cfg/roles.json")

class Role extends Command {
    constructor() {
        super('role', {
          aliases: ["r", "role", "роль"]
        });

        this.listOfMembersRoles = {};
        this.infoAboutMembers = {};
    }

    exec(message) {
      if (message.channel.id !== process.env.SET) return;
      const { nickname } = message.member;
      if (!nickname) return message.channel.send("Вы не указали ни одной роли в никнейме, информация о запросе роли находится в канале - <#672195099551334422>").then(msg => msg.delete({ timeout: 10000 }));
      const nick = nickname.split(' ').map(r => r.toLowerCase());
      message.channel.bulkDelete(1);
      message.channel.send(new MessageEmbed().setAuthor('Ожидайте!').setColor('GREEN').setTimestamp()).then((msg) => msg.delete({ timeout: 3000 }));
  
      this.getRoleArray(nick, message);

      this.client.on('messageReactionAdd', (reaction, user) => {
        this.getEmojiName(reaction, user);
      });
      
    }
  
    async getRoleArray(nick, message) {
      const arrayWithRole = [];
      Object.keys(listOfRoles).forEach((role) => {
        for (let i = 0; i < listOfRoles[role].length; i += 1) {
          if (nick.includes(listOfRoles[role][i].toLowerCase())) {
            arrayWithRole.push(message.guild.roles.cache.get(String(role)));
          }
        }
      });
    
      this.listOfMembersRoles[message.author.id] = {
        role: arrayWithRole,
      };
      this.createEmbed(message);
    }


 
  
  createEmbed(message) {
    const embed = new MessageEmbed()
      .setAuthor('Запрос на роль')
      .setThumbnail(message.author.avatarURL)
      .addField('Аккаунт:', `<@${message.author.id}>`, true)
      .addField('Ник:', message.author.username, true)
      .addField('Роль:', this.listOfMembersRoles[message.author.id].role.map((item) => item), true)
      .addField('Отправлено с канала', `<#${message.channel.id}>`)
      .addField('Команды:', 'Выдать роль - [✅]\nОтказать - [🛑]\nУдалить - [🇩]', true)
      .setColor('GREEN')
      .setFooter('The Star Revenge')
      .setTimestamp();
  
    this.client.channels.cache.get(process.env.GET).send(embed)
      .then(async (msg) => {
        await msg.react('✅');
        await msg.react('❌');
        await msg.react('🇩');
        this.infoAboutMembers[msg.id] = {
          author: message.author.id,
          userID: msg.author.id,
          channel: msg.channel,
          channelID: msg.channel.id,
          msg,
          messageID: msg.id,
          get: message.channel,
          getID: message.channel.id,
        };
      }).catch((err) => console.log(err));
  }
  
  async getEmojiName(reaction, user) {
    const emoji = reaction.emoji.name;
    const messageID = reaction.message.id;
  
    if (!this.infoAboutMembers[messageID] || user.bot) return;
  
    if (emoji === '✅') {
      // eslint-disable-next-line max-len
      const member = reaction.message.guild.members.cache.find((u) => u.id === this.infoAboutMembers[messageID].author);
      await member.roles.add(this.listOfMembersRoles[member.id].role);
  
      this.infoAboutMembers[messageID].channel.send(new MessageEmbed().setAuthor('Успешно!').setDescription(`[ACCEPT] ${user} одобрил запрос пользователю ${member} | ID: ${member.id}`).setColor('GREEN')
        .setTimestamp()
        .setFooter('The Star Revenge'));
      this.infoAboutMembers[messageID].msg.delete({ timeout: 0 });
      this.infoAboutMembers[messageID].get.send(new MessageEmbed().setAuthor('Успешно!').setDescription(`[ACCEPT] ${user} одобрил запрос пользователю ${member} | ID: ${member.id}`).setColor('GREEN')
        .setTimestamp()
        .setFooter('The Star Revenge'));
      delete this.infoAboutMembers[messageID];
    }
  
    if (emoji === '❌') {
      // eslint-disable-next-line max-len
      const member = reaction.message.guild.members.cache.find((u) => u.id === this.infoAboutMembers[messageID].author);
      this.client.channels.cache.get(this.infoAboutMembers[messageID].channelID).send(new MessageEmbed().setAuthor('Отмена!').setDescription(`[REFUSAL] ${user} отклонил запрос пользователю ${member} | ID: ${member.id}`).setColor('RED')
        .setTimestamp()
        .setFooter('The Star Revenge'));
      this.infoAboutMembers[messageID].msg.delete({ timeout: 0 });
      this.client.channels.cache.get(this.infoAboutMembers[messageID].getID).send(new MessageEmbed().setAuthor('Отмена!').setDescription(`[REFUSAL] ${user} отклонил запрос пользователю ${member} | ID: ${member.id}`).setColor('RED')
        .setTimestamp()
        .setFooter('The Star Revenge'));
      delete this.infoAboutMembers[messageID];
    }
  
    if (emoji === '🇩') {
      this.infoAboutMembers[messageID].msg.delete({ timeout: 0 });
      delete this.infoAboutMembers[messageID];
    }
  }
}

module.exports = Role;