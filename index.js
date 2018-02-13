if (process.version.slice(1).split(".")[0] < 8) throw new Error("Node 8.0.0 or higher is required. Update Node on your system.");

const Discord = require("discord.js");
// We also load the rest of the things we need in this file:
const { promisify } = require("util");
const readdir = promisify(require("fs").readdir);
const Enmap = require("enmap");
const EnmapLevel = require("enmap-level");
const klaw = require("klaw");
const path = require("path");
const dbService = require("./services/db.service.js");


class TheEngineBot extends Discord.Client {

  constructor(options) {
    super(options);

    this.config = require("./config.js");

    // Aliases and commands are put in collections
    this.commands = new Enmap();
    this.aliases = new Enmap();

    this.dbConnection = require('./services/db.service');

    // Now we integrate the use of Evie's awesome Enhanced Map module, which
    // essentially saves a collection to disk. This is great for per-server configs,
    // and makes things extremely easy for this purpose.
    //TODO: Need to convert this to fetch all server settings from the database
    this.settings = new Enmap({ provider: new EnmapLevel({ name: "settings" }) });

    // Requiring the Logger class for easy console logging
    this.logger = require("./util/Logger");


  }

  /*
  PERMISSION LEVEL FUNCTION

  This is a very basic permission system for commands which uses "levels"
  "spaces" are intentionally left black so you can add them if you want.
  NEVER GIVE ANYONE BUT OWNER THE LEVEL 10! By default this can run any
  command including the VERY DANGEROUS `eval` command!

  */
  permlevel(message) {
    let permlvl = 0;

    const permOrder = bot.config.permLevels.slice(0).sort((p, c) => p.level < c.level ? 1 : -1);

    while (permOrder.length) {
      const currentLevel = permOrder.shift();
      if (message.guild && currentLevel.guildOnly) continue;
      if (currentLevel.check(message)) {
        permlvl = currentLevel.level;
        break;
      }
    }
    return permlvl;
  }

  loadDatabase(){

  }

  /* 
  COMMAND LOAD AND UNLOAD
  
  To simplify the loading and unloading of commands from multiple locations
  including the index.ejs load loop, and the reload function, these 2 ensure
  that unloading happens in a consistent manner across the board.
  */
  loadCommand(commandPath, commandName) {
    try {
      const props = new (require(`${commandPath}${path.sep}${commandName}`))(bot);
      bot.logger.log(`Loading Command: ${props.help.name}. 👌`, "log");
      props.conf.location = commandPath;
      if (props.init) {
        props.init(bot);
      }
      bot.commands.set(props.help.name, props);
      props.conf.aliases.forEach(alias => {
        bot.aliases.set(alias, props.help.name);
      });
      return false;
    } catch (e) {
      return `Unable to load command ${commandName}: ${e}`;
    }
  }

  async unloadCommand(commandPath, commandName) {
    let command;
    if (bot.commands.has(commandName)) {
      command = bot.commands.get(commandName);
    } else if (bot.aliases.has(commandName)) {
      command = bot.commands.get(bot.aliases.get(commandName));
    }
    if (!command) return `The command \`${commandName}\` doesn"t seem to exist, nor is it an alias. Try again!`;

    if (command.shutdown) {
      await command.shutdown(bot);
    }
    delete require.cache[require.resolve(`${commandPath}${path.sep}${commandName}.js`)];
    return false;
  }

  /* SETTINGS FUNCTIONS
  These functions are used by any and all location in the bot that wants to either
  read the current *complete* guild settings (default + overrides, merged) or that
  wants to change settings for a specific guild.
  */

  // getSettings merges the bot defaults with the guild settings. guild settings in
  // enmap should only have *unique* overrides that are different from defaults.
  getSettings(id) {
    const defaults = bot.config.defaultSettings;

    let guild = bot.settings.get(id);
    if (typeof guild != "object") guild = {};
    const returnObject = {};
    Object.keys(defaults).forEach((key) => {
      returnObject[key] = guild[key] ? guild[key] : defaults[key];
    });
    return returnObject;
  }

  // writeSettings overrides, or adds, any configuration item that is different
  // than the defaults. This ensures less storage wasted and to detect overrides.
  writeSettings(id, newSettings) {
    const defaults = bot.config.defaultSettings;

    let settings = bot.settings.get(id);
    if (typeof settings != "object") settings = {};
    for (const key in newSettings) {
      if (defaults[key] !== newSettings[key]) {
        settings[key] = newSettings[key];
      } else {
        delete settings[key];
      }
    }


    bot.settings.set(id, settings);

    defaults["_id"] = id;
    this.writeSettingsNew(defaults)
  }


  async writeSettingsNew(settings) {
      try {
          let db = await this.dbConnection.Get();
          let result = await db.collection('server-settings').insertOne(settings);

          return result;
      } catch (e) {
          return e;
      }
  }

}

// Main bot instance
const bot = new TheEngineBot();
console.log(bot.config.permLevels.map(p => `${p.level} : ${p.name}`));

// Fetch "global" functions available to the bot
require("./modules/functions.js")(bot);

const init = async () => {

  // Loading all of the command functions into memory
  klaw("./commands/commands").on("data", (item) => {
    const cmdFile = path.parse(item.path);
    if (!cmdFile.ext || cmdFile.ext !== ".js") return;
    const response = bot.loadCommand(cmdFile.dir, `${cmdFile.name}${cmdFile.ext}`);
    if (response) bot.logger.error(response);
  });

  // Loading all of the events into memory
  const evtFiles = await readdir("./events/");
  bot.logger.log(`Loading a total of ${evtFiles.length} events.`, "log");
  evtFiles.forEach(file => {
    const eventName = file.split(".")[0];
    const event = new (require(`./events/${file}`))(bot);

    // Register the events against the bot
    bot.on(eventName, (...args) => event.run(...args));
    delete require.cache[require.resolve(`./events/${file}`)];
  });

  bot.levelCache = {};
  for (let i = 0; i < bot.config.permLevels.length; i++) {
    const thisLevel = bot.config.permLevels[i];
    bot.levelCache[thisLevel.name] = thisLevel.level;
  }

  //Start the bot
  bot.login(bot.config.token);

};

init();

bot.on("disconnect", () => bot.logger.warn("Bot is disconnecting..."))
  .on("reconnect", () => bot.logger.log("Bot reconnecting...", "log"))
  .on("error", e => bot.logger.error(e))
  .on("warn", info => bot.logger.warn(info));