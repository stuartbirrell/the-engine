module.exports = function(app, bot, passport){
    var url = require('url');
    var express = require('express');
    var adminRouter = express.Router();
    var moment = require("moment");

    var Discord = require("discord.js");

    const perms = Discord.EvaluatedPermissions;

    adminRouter.use(function(req, res, next) {
        next();
    });

    adminRouter.get('/', function(req, res) {
        if (!req.session.isAdmin) return res.redirect("/");
        req.app.settings.renderTemplate(res, req, "admin.ejs");
    });

    app.use('/admin',adminRouter);
};