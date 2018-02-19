

module.exports = class {
  constructor(bot) {
    this.bot = bot;
  }

  async run(message) {

    // Ignore messages posted by other bots...and also messages posted by this bot
    if (message.author.bot) return;

    // Grab the settings for this server from the PersistentCollection
    // If there is no guild, get default conf (DMs)

    var settings = await this.bot.getSettings(message.guild.id);


    //const settings = ( message.guild ) ? this.bot.getSettings(message.guild.id) : this.bot.config.defaultSettings;

    // For ease of use in commands and functions, we'll attach the settings
    // to the message object, so `message.settings` is accessible.
    message.settings = settings;

    // Also good practice to ignore any message that does not start with our prefix,
    // which is set in the configuration file.
    if (message.content.indexOf(settings.prefix) !== 0) return;

    // Here we separate our "command" name, and our "arguments" for the command.
    // e.g. if we have the message "+say Is this the real life?" , we'll get the following:
    // command = say
    // args = ["Is", "this", "the", "real", "life?"]
    const args = message.content.slice(settings.prefix.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();

    // Get the user or member's permission level from the elevation
    const level = this.bot.permlevel(message);

    // Check whether the command, or alias, exist in the collections defined
    // in app.js.
    const cmd = this.bot.commands.get(command) || this.bot.commands.get(this.bot.aliases.get(command));
    // using this const varName = thing OR otherthign; is a pretty efficient
    // and clean way to grab one of 2 values!
    if (!cmd) return;

    // Some commands may not be useable in DMs. This check prevents those commands from running
    // and return a friendly error message.
    if (cmd && !message.guild && cmd.conf.guildOnly)
      return message.channel.send("This command is unavailable via private message. Please run this command in a guild.");

    if (level < this.bot.levelCache[cmd.conf.permLevel]) {
      if (settings.systemNotice === "true") {
        return message.channel.send(`You do not have permission to use this command.
Your permission level is ${level} (${this.bot.config.permLevels.find(l => l.level === level).name})
This command requires level ${this.bot.levelCache[cmd.conf.permLevel]} (${cmd.conf.permLevel})`);
      } else {
        return;
      }
    }
      
    // To simplify message arguments, the author's level is now put on level (not member, so it is supported in DMs)
    // The "level" command module argument will be deprecated in the future.
    message.author.permLevel = level;

    message.flags = [];
    while (args[0] &&args[0][0] === "-") {
      message.flags.push(args.shift().slice(1));
    }
    
    // If the command exists, **AND** the user has permission, run it.
    this.bot.logger.log(`${this.bot.config.permLevels.find(l => l.level === level).name} ${message.author.username} (${message.author.id}) ran command ${cmd.help.name}`, "cmd");
    cmd.run(message, args, level);
  }
};