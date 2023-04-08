const express = require('express');
const passport=require('passport');

const app = express();
const {
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
  } = require("../controllers/AuthControllers");

const router = express.Router();

router.get('/', homeRenderController);



router.get('/register', registerRenderController)

router.post('/register', localRegisterController)
    
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



router.get('/login', loginRenderController)

router.post('/login', userLoginController);

router.get('/secrets', secretsAuthController);


router.get('/logout', logoutController);


router.get('/submit', submitRenderController)

router.post(submitSecretController)
;

module.exports = router;