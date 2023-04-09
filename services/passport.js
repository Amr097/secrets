const passport= require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;


const {Account} = require("../models/User");

const {
  CLIENT_ID,
  CLIENT_SECRET,
  GOOGLE_CALLBACK_URL,
  FACEBOOK_APP_ID,
  FACEBOOK_APP_SECRET,
  FACEBOOK_CALLBACK_URL
  } = require("../config");




passport.use(Account.createStrategy());


passport.serializeUser((user, done) => {
    //console.log(user._id)
    done(null, user._id);
  });
  
passport.deserializeUser((async (id, done) => {
    try {
      //console.log(id)
      
      let User = await Account.findById(id, "name email _id");

      if(User){
        //console.log(localUser)
       done(null, User);
      }
      else {
        return done(new Error('user not found'));
      }
    } catch (error) {
      done(error, null);
    }
  }));


  passport.use(new GoogleStrategy({
    clientID: CLIENT_ID,
    clientSecret: CLIENT_SECRET,
    callbackURL: GOOGLE_CALLBACK_URL,
    userProfileURL: "https://www.googleapis.com/oauth2/v3/userinfo"
  },
  function(accessToken, refreshToken, profile, cb) {
    //console.log(profile);
    Account.findOrCreate({ googleId: profile.id, username: profile.displayName }, function (err, user) {
      return cb(err, user);
    });
  }
  ));
  
  passport.use(new FacebookStrategy({
    clientID: FACEBOOK_APP_ID,
    clientSecret: FACEBOOK_APP_SECRET,
    callbackURL: FACEBOOK_CALLBACK_URL
  },
  function(accessToken, refreshToken, profile, cb) {
    //console.log(profile);
   Account.findOrCreate({ facebookId: profile.id }, function (err, user) {
      return cb(err, user);
    });
  }
  ));


  module.exports = passport;

