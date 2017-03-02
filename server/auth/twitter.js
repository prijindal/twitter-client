var passport = require('passport');
var TwitterStrategy = require('passport-twitter').Strategy;

var config = require('../config');

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
