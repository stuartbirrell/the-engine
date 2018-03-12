module.exports = function(app, bot, passport){
    var url = require('url');
    var express = require('express');
    var serverRouter = express.Router();
    var moment = require("moment");

    var Discord = require("discord.js");

    const perms = Discord.EvaluatedPermissions;

    serverRouter.use(function(req, res, next) {
        next();
    });

    serverRouter.get('/', function(req, res) {
        const perms = Discord.EvaluatedPermissions;
        req.app.settings.renderTemplate(res, req, "servers/index.ejs", {perms});
    });


    serverRouter.get("/:guildID", app.settings.checkAuth, (req, res) => {
        res.redirect(`/servers/${req.params.guildID}/dashboard`);
    });


    serverRouter.get("/:guildID/settings/general", app.settings.checkAuth, (req, res) => {
        const guild = bot.guilds.get(req.params.guildID);
        if (!guild) return res.status(404);
        const isManaged = guild && !!guild.member(req.user.id) ? guild.member(req.user.id).permissions.has("MANAGE_GUILD") : false;
        if (!isManaged && !req.session.isAdmin) res.redirect("/");
        req.app.settings.renderTemplate(res, req, "servers/settings/general.ejs", {guild});
    });

    serverRouter.get("/:guildID/settings/eventmessages", app.settings.checkAuth, (req, res) => {
        const guild = bot.guilds.get(req.params.guildID);
        if (!guild) return res.status(404);
        const isManaged = guild && !!guild.member(req.user.id) ? guild.member(req.user.id).permissions.has("MANAGE_GUILD") : false;
        if (!isManaged && !req.session.isAdmin) res.redirect("/");
        req.app.settings.renderTemplate(res, req, "servers/settings/event-messages.ejs", {guild});
    });

    serverRouter.get("/:guildID/settings/invitecontrols", app.settings.checkAuth, (req, res) => {
        const guild = bot.guilds.get(req.params.guildID);
        if (!guild) return res.status(404);
        const isManaged = guild && !!guild.member(req.user.id) ? guild.member(req.user.id).permissions.has("MANAGE_GUILD") : false;
        if (!isManaged && !req.session.isAdmin) res.redirect("/");
        req.app.settings.renderTemplate(res, req, "servers/settings/invite-control.ejs", {guild});
    });

    serverRouter.get("/:guildID/settings/auditing", app.settings.checkAuth, (req, res) => {
        const guild = bot.guilds.get(req.params.guildID);
        if (!guild) return res.status(404);
        const isManaged = guild && !!guild.member(req.user.id) ? guild.member(req.user.id).permissions.has("MANAGE_GUILD") : false;
        if (!isManaged && !req.session.isAdmin) res.redirect("/");
        req.app.settings.renderTemplate(res, req, "servers/settings/auditing.ejs", {guild});
    });


































    serverRouter.get("/:guildID/dashboard", app.settings.checkAuth, (req, res) => {
        const guild = bot.guilds.get(req.params.guildID);
        if (!guild) return res.status(404);
        const isManaged = guild && !!guild.member(req.user.id) ? guild.member(req.user.id).permissions.has("MANAGE_GUILD") : false;
        if (!isManaged && !req.session.isAdmin) res.redirect("/");
        req.app.settings.renderTemplate(res, req, "servers/dashboard.ejs", {guild});
    });


    serverRouter.post("/:guildID/manage", app.settings.checkAuth, (req, res) => {
        const guild = bot.guilds.get(req.params.guildID);
        if (!guild) return res.status(404);
        const isManaged = guild && !!guild.member(req.user.id) ? guild.member(req.user.id).permissions.has("MANAGE_GUILD") : false;
        if (!isManaged && !req.session.isAdmin) res.redirect("/");
        bot.writeSettings(guild.id, req.body);
        res.redirect("/servers/"+req.params.guildID+"/manage");
    });


    serverRouter.get("/:guildID/members", app.settings.checkAuth, async (req, res) => {
        const guild = bot.guilds.get(req.params.guildID);
        if (!guild) return res.status(404);
        req.app.settings.renderTemplate(res, req, "servers/members.ejs", {
            guild: guild,
            members: guild.members.array()
        });
    });


    serverRouter.get("/:guildID/members/list", app.settings.checkAuth, async (req, res) => {
        const guild = bot.guilds.get(req.params.guildID);
        if (!guild) return res.status(404);
        if (req.query.fetch) {
            await guild.fetchMembers();
        }
        const totals = guild.members.size;
        const start = parseInt(req.query.start, 10) || 0;
        const limit = parseInt(req.query.limit, 10) || 50;
        let members = guild.members;

        if (req.query.filter && req.query.filter !== "null") {
            //if (!req.query.filtervalue) return res.status(400);
            members = members.filter(m=> {
                m = req.query.filterUser ? m.user : m;
                return m["displayName"].toLowerCase().includes(req.query.filter.toLowerCase());
            });
        }

        if (req.query.sortby) {
            members = members.sort((a, b) => a[req.query.sortby] > b[req.query.sortby]);
        }
        const memberArray = members.array().slice(start, start+limit);

        const returnObject = [];
        for (let i = 0; i < memberArray.length; i++) {
            const m = memberArray[i];
            returnObject.push({
                id: m.id,
                status: m.user.presence.status,
                bot: m.user.bot,
                username: m.user.username,
                displayName: m.displayName,
                tag: m.user.tag,
                discriminator: m.user.discriminator,
                joinedAt: m.joinedTimestamp,
                createdAt: m.user.createdTimestamp,
                highestRole: {
                    hexColor: m.highestRole.hexColor
                },
                memberFor: moment.duration(Date.now() - m.joinedAt).format(" D [days], H [hrs], m [mins], s [secs]"),
                roles: m.roles.map(r=>({
                    name: r.name,
                    id: r.id,
                    hexColor: r.hexColor
                }))
            });
        }
        res.json({
            total: totals,
            page: (start/limit)+1,
            pageof: Math.ceil(members.size / limit),
            members: returnObject
        });
    });


    serverRouter.get("/:guildID/stats", app.settings.checkAuth, (req, res) => {
        const guild = bot.guilds.get(req.params.guildID);
        if (!guild) return res.status(404);
        const isManaged = guild && !!guild.member(req.user.id) ? guild.member(req.user.id).permissions.has("MANAGE_GUILD") : false;
        if (!isManaged && !req.session.isAdmin) res.redirect("/");
        req.app.settings.renderTemplate(res, req, "servers/stats.ejs", {guild});
    });


    serverRouter.get("/:guildID/leave", app.settings.checkAuth, async (req, res) => {
        const guild = bot.guilds.get(req.params.guildID);
        if (!guild) return res.status(404);
        const isManaged = guild && !!guild.member(req.user.id) ? guild.member(req.user.id).permissions.has("MANAGE_GUILD") : false;
        if (!isManaged && !req.session.isAdmin) res.redirect("/");
        await guild.leave();
        res.redirect("/servers");
    });


    serverRouter.get("/:guildID/reset", app.settings.checkAuth, async (req, res) => {
        const guild = bot.guilds.get(req.params.guildID);
        if (!guild) return res.status(404);
        const isManaged = guild && !!guild.member(req.user.id) ? guild.member(req.user.id).permissions.has("MANAGE_GUILD") : false;
        if (!isManaged && !req.session.isAdmin) res.redirect("/");
        bot.settings.delete(guild.id);
        res.redirect("/servers/"+req.params.guildID);
    });

    app.use('/servers',serverRouter);
};