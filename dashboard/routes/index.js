module.exports = function(app, bot, passport){

    require('./root')(app, bot, passport);
    require('./servers')(app, bot, passport);
    require('./admin')(app, bot, passport);

}