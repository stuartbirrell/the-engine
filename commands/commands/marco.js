const Command = require("../Command");

class Ping extends Command {
  constructor(client) {
    super(client, {
      name: "marco",
      description: "Play Marco Polo",
      usage: "marco",
      aliases: ["pong"]
    });
  }

  async run(message, args, level) { // eslint-disable-line no-unused-vars
    try {
      const msg = await message.channel.send("🏓 polo!");
      msg.edit(`Polo! (Roundtrip took: ${msg.createdTimestamp - message.createdTimestamp}ms. 💙: ${Math.round(this.bot.ping)}ms.)`);
    } catch (e) {
      console.log(e);
    }
  }
}

module.exports = Ping;
