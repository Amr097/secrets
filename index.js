const express = require('express');
const { default: mongoose } = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const bodyParser = require('body-parser');

const Route = require("./routes/Routes");
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
        mongoUrl: URI
    })
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(Route);



mongoose.connect(URI);



app.listen(port, () => console.log(`Example app listening on port ${port}!`));

