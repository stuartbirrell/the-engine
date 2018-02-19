const Command = require("../Command");

class Invite extends Command {
  constructor(client) {
    super(client, {
      name: "invite",
      description: "Generates an invite that you can send to your friends.",
      usage: "invite",
      aliases: ["inv"]
    });
  }

    async run(message, args, level) { // eslint-disable-line no-unused-vars
        try {
            const msg = await message.channel.send("⏳ Generating invite...!");

            message.channel.createInvite({temporary:false})
                .then( invite => {
                    msg.edit(`Invite link has been generated and DM'ed to you`);
                    message.author.sendMessage(`Here is the invite link you requested for the channel '${message.guild.name}'.
                    ${invite.url}`)
                })
                .catch(console.error);
            this.bot.generateInvite().then(link => {

            });

            //msg.edit(`🏓 Pong! (Roundtrip took: ${msg.createdTimestamp - message.createdTimestamp}ms. 💙: ${Math.round(this.bot.ping)}ms.)`);
        } catch (e) {
            console.log(e);
        }
    }
}

module.exports = Invite;
