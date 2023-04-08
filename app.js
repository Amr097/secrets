require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const { default: mongoose } = require('mongoose');
const ejs = require("ejs");
const passport= require('passport');
const passportLocalMongoose = require('passport-local-mongoose');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const session = require('express-session');
const findOrCreate = require('mongoose-findorcreate');
const MongoStore = require('connect-mongo');
const port = 3000;

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

app.use(session({
    secret: process.env.SECRET,
    saveUninitialized: true,
    resave: false,
    store: new MongoStore({
        mongoUrl: 'mongodb://127.0.0.1:27017/accountDB',
        
    })
}));

app.use(passport.initialize());
app.use(passport.session());

mongoose.connect("mongodb://127.0.0.1:27017/accountDB");

const accountSchema = new mongoose.Schema({
    email: String,
    password: {}  
});

const googleAccountSchema = new mongoose.Schema({
    googleId: Number,
    username: {type: String,
               unique: false}   
});

const facebookAccountSchema = new mongoose.Schema({
     facebookId: Number
})

accountSchema.plugin(passportLocalMongoose);
googleAccountSchema.plugin(findOrCreate);
facebookAccountSchema.plugin(findOrCreate);

const Account = new mongoose.model('Account', accountSchema);
const googleAccount = new mongoose.model('Google Account', googleAccountSchema);
const facebookAccount = new mongoose.model('Facebook Account', facebookAccountSchema);

passport.use(Account.createStrategy());


passport.serializeUser((user, done) => {
    console.log(user._id)
    done(null, user._id);
  });
  
passport.deserializeUser((async (id, done) => {
    try {
      console.log(id)
      let googleUser = await googleAccount.findById(id, "name email _id");
      let facebookUser = await facebookAccount.findById(id, "name email _id" );
      let localUser = await Account.findById(id, "name email _id");

      if(localUser){
        console.log(localUser)
       done(null, localUser);
      }
      if(googleUser){
      done(null, googleUser);
      }
      if(facebookAccountSchema){
        done(null, facebookUser);
      }
      else {
        return done(new Error('user not found'));
      }
    } catch (error) {
      done(error, null);
    }
  }));
  

  passport.use(new GoogleStrategy({
    clientID: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    callbackURL: "http://localhost:3000/auth/google/secrets",
    userProfileURL: "https://www.googleapis.com/oauth2/v3/userinfo"
  },
  function(accessToken, refreshToken, profile, cb) {
    //console.log(profile);
    googleAccount.findOrCreate({ googleId: profile.id, username: profile.displayName }, function (err, user) {
      return cb(err, user);
    });
  }
  ));
  
  passport.use(new FacebookStrategy({
    clientID: process.env.FACEBOOK_APP_ID,
    clientSecret: process.env.FACEBOOK_APP_SECRET,
    callbackURL: "http://localhost:3000/auth/facebook/secrets"
  },
  function(accessToken, refreshToken, profile, cb) {
    //console.log(profile);
    facebookAccount.findOrCreate({ facebookId: profile.id }, function (err, user) {
      return cb(err, user);
    });
  }
  ));


app.get('/', (req,res)=>{
    res.render('home');
   });

app.route('/register')

.get((req,res)=>{
    
    res.render('register');
})

.post((req,res)=>{
    const email = req.body.username;
    const password = req.body.password;

    Account.findOne({email:email}).then(account=>{
        if(account){
            console.log('This username is already signed up, please try with a different email');
            res.redirect('/register');
        }
        if(!account){
            Account.register({username: email, active: false}, password, (err, user)=>{
                if(err){
                    console.log(err);
                    res.redirect('/register');
                }
                else{
                    passport.authenticate('local')(req,res, ()=>{
                    res.redirect('/secrets');
                    });
                }
                }) 
        }
    })
    
    })
    
app.get('/auth/google', 
passport.authenticate('google', {scope:['profile']}));

app.get('/auth/google/secrets', passport.authenticate('google', { failureRedirect: '/login' }) , (req,res)=>{
    res.redirect('/secrets');
});

app.get('/login/facebook', passport.authenticate('facebook', {
    scope: [ 'email', 'user_location','public_profile', 'user_friends' , 'user_gender' ]
}));

app.get('/auth/facebook/secrets',
  passport.authenticate('facebook', { failureRedirect: '/register', failureMessage: true }),
  function(req, res) {
    res.redirect('/secrets');
});  

app.route('/login')

.get( (req,res)=>{
    res.render('login'); 
})

.post((req,res)=>{
const user = new Account ({
    username: req.body.username,
    password : req.body.password
});
  
req.login(user, (err)=>{
    if(err){
        console.log(err);
        res.redirect('/login');
    }
    else{
        passport.authenticate('local')(req,res, ()=>{
            res.redirect('/secrets');
        });
    }
    })
});

app.get('/secrets', (req,res)=>{

    if(req.isAuthenticated()){
        res.render('secrets');
    }
    else{
        res.redirect('/login');
    }
});


app.get('/logout', (req,res)=>{
    req.logOut(err=>{
        if(err){
          console.log(err);
        }
        else{
          res.redirect('/');
        }
    });
    
});

app.route('/submit')

.get((req,res)=>{
    res.render('submit');
})

.post((req,res)=>{
    const userSecret = req.body.secret;
})



app.listen(port, () => console.log(`Example app listening on port ${port}!`));
