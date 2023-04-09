const {Account} = require("../models/User");
const passport= require('passport');


const homeRenderController = (req,res)=>{
    res.render('home');
   };

   const registerRenderController = (req,res)=>{
    
    res.render('register');
};

const loginRenderController = (req,res)=>{
    res.render('login'); 
};

const submitRenderController = (req,res)=>{
    if (req.isAuthenticated()){
        res.render('submit');
      }
      else{
        res.redirect('/login');
      }
};

const localRegisterController = (req,res)=>{
    const email = req.body.username;
    const password = req.body.password;

    Account.findOne({email:email}).then(account=>{
        //console.log(account)
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


const userLoginController = (req,res)=>{
    
    const user = new Account ({
        email: req.body.username,
        password : req.body.password
    })
   Account.findOne({username:user.email}).then(account=>{
    //console.log(account);
    if(!account){
        console.log('Account does not exist, please register first');
        res.redirect('/register');
    }
    else{
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
            
    }
   })} ; 
        


const authGoogleController = (req,res)=>{
    res.redirect('/secrets');}
    
const authFacebookController = function(req, res) {
    res.redirect('/secrets');
}


const secretsAuthController = (req,res)=>{

//console.log(req.isAuthenticated())
    if(req.isAuthenticated()){
        
        Account.find({"secret": {$ne :null}}).then(account=>{
            //console.log(account)
            if(account){
               res.render('secrets',{secrets: account});
            }
            else{
                res.redirect('/submit');
            }
        });  
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

const submitSecretController = (req,res)=>{
    const userSecret = req.body.secret;
    const userID =  req.session.passport.user;
    //console.log(userID)

    Account.findOne({_id: userID}).then(account=>{
        
        if(account){

           account.secret=userSecret;
           account.save();
           res.redirect('/secrets');
        }
    });
   

       

};


module.exports={
    localRegisterController,
    authGoogleController,
    authFacebookController,
    userLoginController,
    secretsAuthController,
    logoutController,
    submitSecretController,
    homeRenderController,
    registerRenderController,
    loginRenderController,
    submitRenderController,
}