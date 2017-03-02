const express = require('express');
const passport = require('passport');
var passportTwitter = require('./server/auth/twitter');

const session = require('express-session');

const app = express();

app.use('/css', express.static('css'));
app.use('/img', express.static('img'));
app.use('/js', express.static('js'));
app.use('/node_modules', express.static('node_modules'));
app.set('view engine', 'pug');

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

app.get('/', function (req, res) {
  res.render('index')
})
app.get('/login', function (req, res) {
  res.render('login')
})
app.get('/app', function (req, res) {
  res.render('app')
})

app.get('/auth/twitter', passportTwitter.authenticate('twitter'));

app.get('/auth/twitter/callback',
  passportTwitter.authenticate('twitter', { failureRedirect: '/login' }),
  function(req, res) {
    // Successful authentication
    // console.dir(req);
    res.render('auth', req.user);
  });

module.exports = app;
