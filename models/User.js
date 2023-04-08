const { default: mongoose } = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');
const findOrCreate = require('mongoose-findorcreate');

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

module.exports = {
    googleAccountSchema: googleAccountSchema,
    accountSchema: accountSchema,
    facebookAccountSchema: facebookAccountSchema,
    Account: Account,
    googleAccount: googleAccount,
    facebookAccount: facebookAccount
  }