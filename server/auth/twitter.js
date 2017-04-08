var passport = require('passport');
var TwitterStrategy = require('passport-twitter').Strategy;
const config = require('../../config.json');

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