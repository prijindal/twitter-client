var passport = require('passport');
var TwitterStrategy = require('passport-twitter').Strategy;

const config = {
  twitter: {
    consumerKey: '9NjY4wu59Mz7PlAOUej6PFBlb',
    consumerSecret: 'Rp6ujmVuA9dhX47nuxvPUNXoWdTW4FtrZubiMHQP7ycqmRTz99',
    callbackURL: "http://127.0.0.1:3000/auth/twitter/callback"
  }
};

passport.use(new TwitterStrategy({
    consumerKey: config.twitter.consumerKey,
    consumerSecret: config.twitter.consumerSecret,
    callbackURL: config.twitter.callbackURL
  },
  function(accessToken, refreshToken, profile, done) {
    let user = {
      accessToken,
      refreshToken
    };
    return done(null, user);
  }

));

module.exports = passport;