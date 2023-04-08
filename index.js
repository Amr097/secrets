const express = require('express');
const { default: mongoose } = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const bodyParser = require('body-parser');

const AuthRoute = require("./routes/AuthRoutes");
const passport = require("./services/passport");

const { URI, SECRET } = require("./config");

const app = express();

const port = 3000;

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

app.use(session({
    secret: SECRET,
    saveUninitialized: true,
    resave: false,
    store: new MongoStore({
        mongoUrl: URI,
        ttl: 14 * 24 * 60 * 60   
    })
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(AuthRoute);

mongoose.connect(URI);





app.listen(port, () => console.log(`Example app listening on port ${port}!`));

