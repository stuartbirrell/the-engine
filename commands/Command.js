class Command {
  constructor(client, {
    name = null,
    description = "Unknown",
    category = "Miscellaneous",
    usage = "Unknown",
    enabled = true,
    guildOnly = false,
    aliases = new Array(),
    permLevel = "User"
  }) {
    this.bot = client;
    this.conf = { enabled, guildOnly, aliases, permLevel };
    this.help = { name, description, category, usage };
  }
}
module.exports = Command;
