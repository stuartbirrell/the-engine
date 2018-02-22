const { RichEmbed  } = require('discord.js');

class MessageGenerator {

    static createMessage(description){
        return new RichEmbed()
            .setDescription(description)
    }

    static createPositiveMessage(description){
        return MessageGenerator.createMessage(description)
            .setColor(0x00FF00);
    }

    static createNegativeMessage(description){
        return MessageGenerator.createMessage(description)
            .setColor(0xFF1A00);
    }
};


module.exports = MessageGenerator;