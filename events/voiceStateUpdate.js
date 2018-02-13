// This event executes when a new guild (server) is left.

module.exports = class {
    constructor(bot) {
        this.bot = bot;
    }

    async run(oldStatus, newStatus) {

        var user       = oldStatus.user;
        var oldChannel = (oldStatus.voiceChannelID == null)?null:oldStatus.guild.channels.get(oldStatus.voiceChannelID);
        var newChannel = (newStatus.voiceChannelID == null)?null:newStatus.guild.channels.get(newStatus.voiceChannelID);

        // Determine what kind of voice status update was performed and log a message related to the activity
        if((oldChannel == null) && ( newChannel != null )){
            this.bot.logger.log(`${user.username} joined the channel '${newChannel.name}'`);
        }
        else if((oldChannel != null) && ( newChannel == null )){
            this.bot.logger.log(`${user.username} left the channel '${oldChannel.name}'`);
        }
        else if((oldChannel != null) && ( newChannel != null )){
            this.bot.logger.log(`${user.username} switched channels from '${oldChannel.name}' to '${newChannel.name}'`);
        }
        else{
            this.bot.logger.log(`Undefined voice change occurred`);
        }

    }
};
