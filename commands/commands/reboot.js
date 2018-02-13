const Command = require("../Command");

class Reboot extends Command {
  constructor(client) {
    super(client, {
      name: "reboot",
      description: "The bot will restart.",
      category: "System",
      usage: "reboot",
      aliases: []
    });
  }

  async run(message, args, level) { // eslint-disable-line no-unused-vars
    try {
      await message.reply("Bot is shutting down.");
      this.bot.commands.forEach(async cmd => {
        await this.bot.unloadCommand(cmd);
      });
      process.exit(1);
    } catch (e) {
      console.log(e);
    }
  }
}

module.exports = Reboot;