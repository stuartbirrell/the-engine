// Native Node Imports
const url = require("url");
const path = require("path");

// Used for Permission Resolving...
const Discord = require("discord.js");

// Express Session
var express = require("express");
var app = express();

require("moment-duration-format");

// Express Plugins
// Specifically, passport helps with oauth2 in general.
// passport-discord is a plugin for passport that handles Discord's specific implementation.
// express-session and level-session-store work together to create persistent sessions
// (so that when you come back to the page, it still remembers you're logged in).
var passport = require("passport");
var session = require("express-session");
var LevelStore = require("level-session-store")(session);
var Strategy = require("passport-discord").Strategy;

// Helmet is specifically a security plugin that enables some specific, useful
// headers in your page to enhance security.
var helmet = require("helmet");

// Used to parse Markdown from things like ExtendedHelp
var md = require("marked");





module.exports = function(bot){

    // It's easier to deal with complex paths.
    // This resolves to: yourbotdir/dashboard/
    const dataDir = path.resolve(`${process.cwd()}${path.sep}dashboard`);

    // This resolves to: yourbotdir/dashboard/templates/
    // which is the folder that stores all the internal template files.
    const templateDir = path.resolve(`${dataDir}${path.sep}templates`);

    // The public data directory, which is accessible from the *browser*.
    // It contains all css, bot javascript, and images needed for the site.
    app.use("/public", express.static(path.resolve(`${dataDir}${path.sep}public`)));

    app.set('renderTemplate', function(res, req, template, data){
        const baseData = {
            bot: bot,
            path: req.path,
            user: req.isAuthenticated() ? req.user : null
        };
        res.render(path.resolve(`${templateDir}${path.sep}${template}`), Object.assign(baseData, data));
    });

    app.set('checkAuth', function(req, res, next){
        if (req.isAuthenticated()) return next();
        req.session.backURL = req.url;
        res.redirect("/login");
    });


    // These are... internal things related to passport. Honestly I have no clue either.
    // Just leave 'em there.
    passport.serializeUser((user, done) => {
        done(null, user);
    });
    passport.deserializeUser((obj, done) => {
        done(null, obj);
    });

    /*
    This defines the **Passport** oauth2 data. A few things are necessary here.

    clientID = Your bot's bot ID, at the top of your app page. Please note,
      older bots have BOTH a bot ID and a Bot ID. Use the Client one.
    clientSecret: The secret code at the top of the app page that you have to
      click to reveal. Yes that one we told you you'd never use.
    callbackURL: The URL that will be called after the login. This URL must be
      available from your PC for now, but must be available publically if you're
      ever to use this dashboard in an actual bot.
    scope: The data scopes we need for data. identify and guilds are sufficient
      for most purposes. You might have to add more if you want access to more
      stuff from the user. See: https://discordapp.com/developers/docs/topics/oauth2

    See config.js.example to set these up.
    */
    passport.use(new Strategy({
            clientID: bot.appInfo.id,
            clientSecret: bot.config.dashboard.oauthSecret,
            callbackURL: bot.config.dashboard.callbackURL,
            scope: ["identify", "guilds"]
        },
        (accessToken, refreshToken, profile, done) => {
            process.nextTick(() => done(null, profile));
        }));

    // Session data, used for temporary storage of your visitor's session information.
    // the `secret` is in fact a "salt" for the data, and should not be shared publicly.
    app.use(session({
        store: new LevelStore("./data/dashboard-session/"),
        secret: bot.config.dashboard.sessionSecret,
        resave: false,
        saveUninitialized: false,
    }));

    // Initializes passport and session.
    app.use(passport.initialize());
    app.use(passport.session());
    app.use(helmet());

    // The domain name used in various endpoints to link between pages.
    app.locals.domain = bot.config.dashboard.domain;

    // The EJS templating engine gives us more power to create complex web pages.
    // This lets us have a separate header, footer, and "blocks" we can use in our pages.
    app.engine("html", require("ejs").renderFile);
    app.set("view engine", "html");

    // body-parser reads incoming JSON or FORM data and simplifies their
    // use in code.
    var bodyParser = require("body-parser");
    app.use(bodyParser.json());       // to support JSON-encoded bodies
    app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
        extended: true
    }));


    // Start the site
    bot.site = app.listen(bot.config.dashboard.port);

    // Routes
    routes = require('./routes')(app, bot, passport);
}



