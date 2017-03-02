const express = require('express');
const passport = require('passport');
var passportTwitter = require('./server/auth/twitter');

const session = require('express-session');

const app = express();

app.set('view engine', 'pug');

app.set('views', 'app/views')

app.use(session({
  secret: 'my secret',
  resave: true,
  saveUninitialized: true,
}));

app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  done(null, user);
});

app.get('/auth/twitter', passportTwitter.authenticate('twitter'));

app.get('/auth/twitter/callback',
  passportTwitter.authenticate('twitter', { failureRedirect: '/login' }),
  function(req, res) {
    // Successful authentication
    // console.dir(req);
    res.render('auth', req.user);
  });

module.exports = app;
