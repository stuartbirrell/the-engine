const defaultSettings = {
    prefix: "-",
    modLogChannel: "mod-log",
    modRole: "Moderator",
    adminRole: "Administrator",
    systemNotice: "true",
    audit:{
        enabled: true,
        channel: "channel-log"
    },
    roles:{
        modRole: "Moderator",
        adminRole: "Admin"
    },
    eventMessages:{
        welcome:{
            enabled: "false",
            channel: "Welcome",
            message: "Say hello to {{user}}, everyone! We all need a warm welcome sometimes :D"
        },
        kick:{
            enabled: "false",
            channel: "Kicked",
            message: "{{user}} has been kicked"
        },
        ban:{
            enabled: "false",
            channel: "Banned",
            message: "{{user}} has been BANNED!"
        }
    }
};


module.exports = defaultSettings;