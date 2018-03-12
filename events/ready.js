var DbConnection = require('../services/db.service');

module.exports = class {
  constructor(bot) {
    this.bot = bot;
  }

  async run() {



    // Why await here? Because the ready event isn't actually ready, sometimes
    // guild information will come in *after* ready. 1s is plenty, generally,
    // for all of them to be loaded.
    // NOTE: bot.wait and bot.log are added by ./modules/functions.js !
    await this.bot.wait(1000);

    // This loop ensures that bot.appInfo always contains up to date data
    // about the app's status. This includes whether the bot is public or not,
    // its description, owner, etc. Used for the dashboard amongs other things.
    this.bot.appInfo = await this.bot.fetchApplication();
    setInterval( async () => {
      this.bot.appInfo = await this.bot.fetchApplication();
    }, 60000);

    // This step will re-write the "default" settings into the database on first start-up (to ensure that any changes in code are picked up)
    //if (!this.bot.settings().has("default")) {
    //  if (!this.bot.config.defaultSettings) throw new Error("defaultSettings not preset in config.js or settings database. Bot cannot load.");
    //  this.bot.settings.set("default", this.bot.config.defaultSettings);
    //}

    // Initializes the dashboard, which must be done on ready otherwise some data may be missing.
    require("../dashboard/index.js")(this.bot);
    
    // Set the game as the default help command + guild count.
    // NOTE: This is also set in the guildCreate and guildDelete events!
    this.bot.user.setActivity({game: {name: `${this.bot.config.defaultSettings.general.prefix}help | ${this.bot.guilds.size} Servers`, type:0}});

    // Log that we're ready to serve, so we know the bot accepts commands.
    this.bot.logger.log(`${this.bot.user.tag}, ready to serve ${this.bot.users.size} users in ${this.bot.guilds.size} servers.`, "ready");  }
};
