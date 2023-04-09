const express = require('express');
const passport=require('passport');

const {
  homeRenderController,
  registerRenderController,
  loginRenderController,
  submitRenderController,
    localRegisterController,
    authGoogleController,
    authFacebookController,
    userLoginController,
    secretsAuthController,
    logoutController,
    submitSecretController
  } = require("../controllers/Controllers");

const router = express.Router();


router.get('/', homeRenderController);

router.get('/register', registerRenderController);

router.get('/login', loginRenderController);


router.post('/register', localRegisterController);
    
router.get('/auth/google', 
passport.authenticate('google', {scope:['profile']}));

router.get('/auth/google/secrets', passport.authenticate('google', { failureRedirect: '/login' }) , 
authGoogleController 
);

router.get('/login/facebook', passport.authenticate('facebook', {
    scope: [ 'email', 'user_location','public_profile', 'user_friends' , 'user_gender' ]
}));

router.get('/auth/facebook/secrets',
  passport.authenticate('facebook', { failureRedirect: '/register', failureMessage: true }),
  authFacebookController);  



router.post('/login', userLoginController);

router.get('/secrets', secretsAuthController);

router.get('/submit', submitRenderController);

router.post('/submit', submitSecretController);

router.get('/logout', logoutController);





module.exports = router;