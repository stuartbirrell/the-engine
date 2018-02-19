// This event executes when a new member joins a server. Let's welcome them!

module.exports = class {
  constructor(bot) {
    this.bot = bot;
  }

  async run(member) {
    // Load the guild's settings
    var settings = await this.bot.getSettings(member.guild.id);
  
    // If welcome is off, don't proceed (don't welcome the user)
    if (settings.eventMessages.userLeave.enabled !== "true") return;

    // Replace the placeholders in the welcome message with actual data
    const message = settings.eventMessages.userLeave.message.replace("{{user}}", member.user.tag);

    // Send the welcome message to the welcome channel.
    // There's a place for more configs here.
    member.guild.channels.find("name", settings.eventMessages.userLeave.channel.toLowerCase()).send(message).catch(console.error);
  }
};
