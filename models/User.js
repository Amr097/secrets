const { default: mongoose } = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');
const findOrCreate = require('mongoose-findorcreate');

const accountSchema = new mongoose.Schema({
    email: String,
    password: {},
    secret: {},
    googleId: Number,
    username: {type: String,
               unique: false},
    facebookId: Number            
});



accountSchema.plugin(passportLocalMongoose);
accountSchema.plugin(findOrCreate);


const Account = new mongoose.model('Account', accountSchema);


module.exports = {
    Account: Account,
  }