const defaultSettings = {
    prefix: "-",
    modLogChannel: "mod-log",
    modRole: "Moderator",
    adminRole: "Administrator",
    systemNotice: "true",
    inviteControl: {
        enabled: "true",
        tempInviteWhiteList: [""],
        defaultInviteWhiteList: ["can-invite"],
        defaultInviteTemplate: {
            temporary:false,
            maxAge: 86400,
            maxUses: 1,
            unique: true,
            reason: "Bot generated default invite by user {{user}}"
        },
        tempInviteTemplate:{
            temporary:true,
            maxAge: 86400,
            maxUses: 1,
            unique: true,
            reason: "Bot generated temporary invite by user {{user}}"
        }
    },
    audit:{
        enabled: true,
        channel: "channel-log",
        channelBlacklist:[
            "admin-chat",
            "mod-chat"
        ],
        actions:{
            channelCreate: "true",
            channelDelete: "true",
            channelPinsUpdate: "true",
            channelCreate: "true",
            channelUpdate: "true",
            clientUserGuildSettingsUpdate: "true",
            clientUserSettingsUpdate: "true",
            emojiCreate: "true",
            emojiUpdate: "true",
            emojiDelete: "true",
            guildBanAdd: "true",
            guildBanRemove: "true",
            guildCreate: "true",
            guildDelete: "true",
            guildMemberAdd: "true",
            guildMemberAvailable: "true",
            guildMemberRemove: "true",
            guildMemberUpdate: "true",
            guildUpdate: "true",
            message: "true",
            messageDelete: "true",
            messageDeleteBulk: "true",
            messageReactionAdd: "true",
            messageReactionRemove: "true",
            messageReactionRemoveAll: "true",
            messageUpdate: "true",
            roleCreate: "true",
            roleDelete: "true",
            roleUpdate: "true",
            userUpdate: "true"
        }
    },
    roles:{
        modRole: "Moderator",
        adminRole: "Admin"
    },
    eventMessages:{
        userJoin:{
            enabled: "true",
            channel: "Welcome",
            message: "Say hello to {{user}}, everyone! We all need a warm welcome sometimes :D"
        },
        userLeave:{
            enabled: "true",
            channel: "Welcome",
            message: "Say goodbye to {{user}}, everyone! They were a cunt anyway :D"
        },
        userBanned:{
            enabled: "true",
            channel: "Welcome",
            message: "{{user}} has been banned!"
        },
        userUnbanned:{
            enabled: "true",
            channel: "Welcome",
            message: "{{user}}'s ban has been lifted"
        }
    }

};


module.exports = defaultSettings;