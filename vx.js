const Discord = require("discord.js");
const client = new Discord.Client();

function clean(text) {
    if (typeof(text) === "string")
      return text.replace(/`/g, "`" + String.fromCharCode(8203)).replace(/@/g, "@" + String.fromCharCode(8203));
    else
        return text;
}

var prefix = "v";
var token = " ";

client.on("ready", () => {
  console.log("Tickets | Logged in! Server count: ${client.guilds.size}");
  client.user.setGame(`on LiteAlts`);
});

client.on("guildCreate", (guild) => {
client.user.setGame(`on LiteAlts`);
    guild.owner.user.send(`Time to kick out tickety!`);
});

client.on("message", (message) => {
  if (!message.content.startsWith(prefix) || message.author.bot) return;

  if (message.content.toLowerCase().startsWith(prefix + `help`)) {
    const embed = new Discord.RichEmbed()
    .setTitle(`Is it a bird? A plane? no.. its Collier's tickets!`)
    .setColor(0xCF40FA)
    .setDescription(``)
    .addField(`Tickets`, `[${prefix}new]() > Opens up a new ticket\n[${prefix}close]() > Closes a ticket.`)
    .addField(`Other`, `[${prefix}help]() > Shows you this help menu\n[${prefix}ping]() > Pings the bot to see how long it takes to respond.`)
    message.channel.send({ embed: embed });
  }

  if (message.content.toLowerCase().startsWith(prefix + `ping`)) {
    message.channel.send(`One moment!`).then(m => {
    m.edit(`**Pong!**\ Math.round(client.ping) + `ms.`);
    });
}

if (message.content.toLowerCase().startsWith(prefix + `new`)) {
    const reason = message.content.split(" ").slice(1).join(" ");
    if (!message.guild.roles.exists("name", "Support Team")) return message.channel.send(`This server doesn't have a `Staff` role made, so the ticket won't be opened.`);
    if (message.guild.channels.exists("name", "ticket-" + message.author.id)) return message.channel.send(`Sorry, you already have a ticket open.`);
    message.guild.createChannel(`ticket-${message.author.id}`, "text").then(c => {
        let role = message.guild.roles.find("name", "Staff");
        let role2 = message.guild.roles.find("name", "@everyone");
        c.overwritePermissions(role, {
            SEND_MESSAGES: true,
            READ_MESSAGES: true
        });
        c.overwritePermissions(role2, {
            SEND_MESSAGES: false,
            READ_MESSAGES: false
        });
        c.overwritePermissions(message.author, {
            SEND_MESSAGES: true,
            READ_MESSAGES: true
        });
        message.channel.send(`:white_check_mark: Ok, i made your ticket!, #${c.name}.`);
        const embed = new Discord.RichEmbed()
        .setColor(0xCF40FA)
        .addField(`Hey ${message.author.username}!`, `Thanks for contacting us. We will be here to help you shortly!`)
        .setTimestamp();
        c.send({ embed: embed });
    }).catch(console.error);
}
if (message.content.toLowerCase().startsWith(prefix + `close`)) {
    if (!message.channel.name.startsWith(`ticket-`)) return message.channel.send(`Sorry, You can't use this outside of a ticket channel!`);

    message.channel.send(`Ok. Please type this command again to close the ticket. Else, this request will expire in 10 seconds.`)
    .then((m) => {
      message.channel.awaitMessages(response => response.content === '-confirm', {
        max: 1,
        time: 10000,
        errors: ['time'],
      })
      .then((collected) => {
          message.channel.delete();
        })
        .catch(() => {
          m.edit('Timed out, ticket not closed.').then(m2 => {
              m2.delete();
          }, 3000);
        });
    });
}

});

client.login(token);
