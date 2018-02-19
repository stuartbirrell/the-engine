// This event executes when a new member joins a server. Let's welcome them!

module.exports = class {
  constructor(bot) {
    this.bot = bot;
  }

  async run(guild, user) {
    // Load the guild's settings
    var settings = await this.bot.getSettings(guild.id);
  
    // If welcome is off, don't proceed (don't welcome the user)
    if (settings.eventMessages.userJoin.enabled !== "true") return;

    // Replace the placeholders in the welcome message with actual data
    const message = settings.eventMessages.userUnbanned.message.replace("{{user}}", user.tag);

    // Send the welcome message to the welcome channel.
    // There's a place for more configs here.
    guild.channels.find("name", settings.eventMessages.userUnbanned.channel.toLowerCase()).send(message).catch(console.error);
  }
};
