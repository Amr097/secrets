const {Account} = require("../models/User");
const passport= require('passport');

const localRegisterController = (req,res)=>{
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
                }    }) 
        }
    })
    
    };

const homeRenderController = (req,res)=>{
    res.render('home');
   }

const registerRenderController = (req,res)=>{
    
    res.render('register');
} 

const authGoogleController = (req,res)=>{
    res.redirect('/secrets');}
    
const authFacebookController = function(req, res) {
    res.redirect('/secrets');
}

const loginRenderController = (req,res)=>{
    res.render('login'); 
}

const userLoginController = (req,res)=>{
    
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
};

const secretsAuthController = (req,res)=>{

    if(req.isAuthenticated()){
        res.render('secrets');
    }
    else{
        res.redirect('/login');
    }
};

const logoutController = (req,res)=>{
    req.logOut(err=>{
        if(err){
          console.log(err);
        }}
    );
    res.redirect('/');
}

const submitRenderController = (req,res)=>{
    res.render('submit');
};

const submitSecretController = (req,res)=>{
    const userSecret = req.body.secret;
}


module.exports={
    homeRenderController,
    registerRenderController,
    localRegisterController,
    authGoogleController,
    authFacebookController,
    loginRenderController,
    userLoginController,
    secretsAuthController,
    logoutController,
    submitRenderController,
    submitSecretController
}