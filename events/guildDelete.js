// This event executes when a new guild (server) is left.

module.exports = class {
  constructor(bot) {
    this.bot = bot;
  }

  async run(guild) {
    this.bot.user.setPresence({game: {name: `${this.bot.config.defaultSettings.general.prefix}help | ${this.bot.guilds.size} Servers`, type:0}});
    
    // Well they're gone. Let's remove them from the settings!
    this.bot.settings.delete(guild.id);
  }
};
