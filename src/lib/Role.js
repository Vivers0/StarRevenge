const { Command } = require("discord-akairo");
const { MessageEmbed } = require("discord.js")

class Role extends Command {
    constructor() {
        super('role', {
          aliases: ["r", "role", "роль"]
        });

       this.list = {};
       this.arrayWithRole = [];
       this.lib = {};
    }

    exec(message) {
      try {
        if (message.channel.id !== process.env.GET) return;
        let nickname = message.member.nickname;
        if (!nickname) return message.channel.send("Вы не указали ни одной роли в нике!")
        let nick = nickname.split(" ");

        message.channel.bulkDelete(1)
        message.channel.send(new MessageEmbed().setAuthor("Ожидайте!").setColor("GREEN").setTimestamp()).then(msg => msg.delete({ timeout: 3000 }));
        this.getRoleArray(nick, message)
        
        let embed = new MessageEmbed()
          .setAuthor("Запрос на роль")
          .setThumbnail(message.author.avatarURL)
          .addField("Аккаунт:", "<@" + message.author.id + ">", true)
          .addField("Ник:", message.author.username, true)
          .addField("Роль:", this.lib[message.author.id].role.map(item => "<@&"+item+">"), true)
          .addField("Отправлено с канала", `<#${message.channel.id}>`)
          .addField("Команды:", `Выдать роль - [✅]\nОтказать - [🛑]\nУдалить - [🇩]`, true)
          .setColor("GREEN")
          .setFooter("The Star Revenge")
          .setTimestamp();

      this.client.channels.cache.get(process.env.SET).send(embed)
      .then(async msg => {
        await msg.react("✅");
        await msg.react("❌");
        await msg.react("🇩");
        this.list[msg.id] = {
            author: message.author.id,
            userID: msg.author.id,
            channel: msg.channel,
            channelID: msg.channel.id,
            msg_: msg,
            msg_id: msg.id,
            get: message.channel,
            getID: message.channel.id
        }}).catch(err => console.log(err));
        
        

        message.client.on("messageReactionAdd", (reaction, user) => {
            try {
           this.getEmojiName(reaction, user)
            } catch(e) {
                console.log(e)
            }
          })
        } catch(e) {
          console.log(e)
        }
    }

    async getEmojiName(reaction, user) {
        const emoji = reaction.emoji.name;
        const msg_id = reaction.message.id;
        

        if(!this.list[msg_id] || user.bot) return;
        
        if(emoji === "✅"){
          const member = reaction.message.guild.members.cache.find(u => u.id === this.list[msg_id].author);
          await member.roles.add(this.lib[member.id].role)
      
          this.list[msg_id].channel.send(new MessageEmbed().setAuthor("Успешно!").setDescription(`[ACCEPT] ${user} одобрил запрос пользователю ${member} | ID: ${member.id}`).setColor("GREEN").setTimestamp().setFooter("The Star Revenge"));
          this.list[msg_id].msg_.delete({ timeout: 0 });
          this.list[msg_id].get.send(new MessageEmbed().setAuthor("Успешно!").setDescription(`[ACCEPT] ${user} одобрил запрос пользователю ${member} | ID: ${member.id}`).setColor("GREEN").setTimestamp().setFooter("The Star Revenge"));
          delete this.list[msg_id];
        }

        if(emoji == "❌"){
          const member = reaction.message.guild.members.cache.find(u => u.id === this.list[msg_id].author);
          this.client.channels.cache.get(this.list[msg_id].channelID).send(new MessageEmbed().setAuthor("Отмена!").setDescription(`[REFUSAL] ${user} отклонил запрос пользователю ${member} | ID: ${member.id}`).setColor("RED").setTimestamp().setFooter("The Star Revenge"));
          this.list[msg_id].msg_.delete({ timeout: 0 });
          this.client.channels.cache.get(this.list[msg_id].getID).send(new MessageEmbed().setAuthor("Отмена!").setDescription(`[REFUSAL] ${user} отклонил запрос пользователю ${member} | ID: ${member.id}`).setColor("RED").setTimestamp().setFooter("The Star Revenge"))
          delete this.list[msg_id];
        }

        if(emoji == "🇩"){
          this.list[msg_id].msg_.delete({ timeout: 0 });
          delete this.list[msg_id]
        }
    }


    getRoleArray(nick, message) {
        var arrayWithRole = []
        if (nick.includes("RCT") ||
        nick.includes("PVT") ||
        nick.includes("PFC") ||
        nick.includes("SPC") ||
        nick.includes("CPL")) {
      arrayWithRole.push(message.guild.roles.cache.find(r => r.name === "Рядовой состав").id)
    }
    if (nick.includes("SGT") ||
        nick.includes("SGM")) {
        arrayWithRole.push(message.guild.roles.cache.find(r => r.name === "Сержантский состав").id)
    }
    if (nick.includes("WO1") ||
        nick.includes("WO2") ||
        nick.includes("WO3")) {
        arrayWithRole.push(message.guild.roles.cache.find(r => r.name === "Уоррент-офицерский состав").id)
    }
    if (nick.includes("LT1") ||
        nick.includes("LT2")) {
        arrayWithRole.push(message.guild.roles.cache.find(r => r.name === "Офицерский состав").id)
    }
    if (nick.includes("CPT") ||
        nick.includes("MAJ") ||
        nick.includes("CC")) {
      arrayWithRole.push(message.guild.roles.cache.find(r => r.name === "Старший офицерский состав").id)
    }
    if (nick.includes("CT")) {
      arrayWithRole.push(message.guild.roles.cache.find(r => r.name === "Клон Солдат").id)
    }
    if (nick.includes("104th")) {
      arrayWithRole.push(message.guild.roles.cache.find(r => r.name === "104-й Батальон Поддержки").id)
    }
    if (nick.includes("212th")) {
      arrayWithRole.push(message.guild.roles.cache.find(r => r.name === "212-ый Штурмовой Батальон").id)
    }
    if (nick.includes("501th")) {
      arrayWithRole.push(message.guild.roles.cache.find(r => r.name === "501-ый легион").id)
    }
    if (nick.includes("21st")) {
      arrayWithRole.push(message.guild.roles.cache.find(r => r.name === "21-й Межгалактический Корпус").id)
    }
    if (nick.includes("Assasins")) {
      arrayWithRole.push(message.guild.roles.cache.find(r => r.name === "Клон Ассасин").id)
    }
    if (nick.includes("Sectorial")) {
      arrayWithRole.push(message.guild.roles.cache.find(r => r.name === "Секториальное Командование").id)
    }
    if (nick.includes("DOOM")) {
      arrayWithRole.push(message.guild.roles.cache.find(r => r.name === "Рота DOOM").id)
    }
    if (nick.includes("Jedi")) {
      arrayWithRole.push(message.guild.roles.cache.find(r => r.name === "Джедаи").id)
    }
    if (nick.includes("RC")) {
      arrayWithRole.push(message.guild.roles.cache.find(r => r.name === "Republic Commando").id)
    }
    if (nick.includes("Guard")) {
      arrayWithRole.push(message.guild.roles.cache.find(r => r.name === "Гвардия").id)
    }

        this.lib[message.author.id] = {
            role: arrayWithRole
        }
    }
}

module.exports = Role;