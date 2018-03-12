module.exports = function(app, bot, passport){

    var url = require('url');
    var path = require("path");
    var express = require('express');
    var Discord = require("discord.js");
    var moment = require("moment");
    var md = require("marked");

    const perms = Discord.EvaluatedPermissions;

    var rootRouter = express.Router();

    rootRouter.use(function(req, res, next) {
        next();
    });


    rootRouter.get("/", (req, res) => {

        const duration = moment.duration(bot.uptime).format(" D [days], H [hrs], m [mins], s [secs]");
        const members = bot.guilds.reduce((p, c) => p + c.memberCount, 0);
        const textChannels = bot.channels.filter(c => c.type === "text").size;
        const voiceChannels = bot.channels.filter(c => c.type === "voice").size;
        const guilds = bot.guilds.size;

        req.app.settings.renderTemplate(res, req, "index.ejs", {
            stats: {
                servers: guilds,
                members: members,
                text: textChannels,
                voice: voiceChannels,
                uptime: duration,
                memoryUsage: (process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2),
                dVersion: Discord.version,
                nVersion: process.version
            }
        });
    });


    // The list of commands the bot has.
    // TODO - [SBirrell]: Currently **not filtered** by permission
    rootRouter.get("/commands", (req, res) => {
        req.app.settings.renderTemplate(res, req, "commands.ejs", {md});
    });

    rootRouter.get("/login", (req, res, next) => {
            if (req.session.backURL) {
                req.session.backURL = req.session.backURL;
            } else if (req.headers.referer) {
                const parsed = url.parse(req.headers.referer);
                if (parsed.hostname === app.locals.domain) {
                    req.session.backURL = parsed.path;
                }
            } else {
                req.session.backURL = "/";
            }
            next();
        },
        passport.authenticate("discord"));


    rootRouter.get("/callback", passport.authenticate("discord", { failureRedirect: "/autherror" }), (req, res) => {
        if (req.user.id === bot.appInfo.owner.id) {
            req.session.isAdmin = true;
        } else {
            req.session.isAdmin = false;
        }
        if (req.session.backURL) {
            const url = req.session.backURL;
            req.session.backURL = null;
            res.redirect(url);
        } else {
            res.redirect("/");
        }
    });

    rootRouter.get("/autherror", (req, res) => {
        req.app.settings.renderTemplate(res, req, "autherror.ejs");
    });

    // Destroys the session to log out the user.
    rootRouter.get("/logout", function(req, res) {
        req.session.destroy(() => {
            req.logout();
            res.redirect("/");
        });
    });

    app.use('/',rootRouter);
};