const Command = require("../../Command");
const MsgGen  = require("../../../modules/message.generator");

class Invite extends Command {
  constructor(client) {
    super(client, {
      name: "invite",
      description: "Generates an invite that you can send to your friends.",
        category: "General",
      usage: "invite",
      aliases: ["inv"]
    });
  }

    async run(message, args, level) { // eslint-disable-line no-unused-vars
        try {
            const msg = await message.channel.send(MsgGen.createPositiveMessage("⏳ Generating invite..."))

            // Load the guild's settings
            var settings = await this.bot.getSettings(message.guild.id);


            // If the bot is configured to do invite control then we have some special steps to do
            if (settings.inviteControl.enabled == "true"){

                if( message.member.permissions.has('CREATE_INSTANT_INVITE') ){
                    this.generateDefaultInvite(settings, message, msg);
                }
                else{
                    this.cantCreate(msg, "You do not have the necessary permissions");
                }
            }
            else{
                if( message.member.permissions.has('CREATE_INSTANT_INVITE') ){
                    this.generateDefaultInvite(settings, message, msg);
                }
                else{
                    this.cantCreate(msg, "You do not have the necessary permissions");
                }
            }

            //msg.edit(`🏓 Pong! (Roundtrip took: ${msg.createdTimestamp - message.createdTimestamp}ms. 💙: ${Math.round(this.bot.ping)}ms.)`);
        } catch (e) {
            console.log(e);
        }
    }

    async generateTempInvite(settings, message, msg){
        var inviteOptions = settings.inviteControl.tempInviteTemplate;

        inviteOptions.reason = inviteOptions.reason.replace("{{user}}", message.member.nickname);
    }

    async generateDefaultInvite(settings, message, msg){

      var inviteOptions = settings.inviteControl.defaultInviteTemplate;

      inviteOptions.reason = inviteOptions.reason.replace("{{user}}", message.member.nickname);

        message.channel.createInvite(inviteOptions)
            .then( invite => {
                msg.edit(MsgGen.createPositiveMessage(`Invite link has been generated and DM'ed to you`));
                message.author.send(`Here is the invite link you requested for the channel '${message.guild.name}'.  ${invite.url}`)
            })
            .catch(error => {
                if(error.message == "Missing Permissions") {
                    msg.edit(MsgGen.createNegativeMessage(`This bot does not have permissions to generate invites - contact a System Administrator`));
                }
                else{
                    msg.edit(MsgGen.createNegativeMessage(`Unable to generate invite - contact a System Administrator`));
                }
                console.error(error);
            });
    }

    async cantCreate(msg, reason){
        msg.edit(MsgGen.createNegativeMessage(`Unable to create invite for you at the moment. ${reason}`));

    }
}

module.exports = Invite;
