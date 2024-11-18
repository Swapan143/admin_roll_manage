const express = require('express');
const dotenv  = require('dotenv').config();
const connectDb = require('./config/db');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const flash = require('connect-flash');


const app = express();
const port    = process.env.PORT;
const helpers = require('./helpers/helpers');

//conect to mongo db database
connectDb();

//midelware
app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({extended:false}));

//cookie midelware
app.use(cookieParser(process.env.COOKIE_SECRET));

//session midelware
app.use(session({
    secret:process.env.SESSION_SECRET,
    resave:false,
    saveUninitialized:false,
    cookie:{
        maxAge:6000*60*24*7 //1 week
    }
}));

//flash message
app.use(flash());

//store flash message
app.use((req,res,next)=>{
    res.locals.message=req.flash();
    next();
})

//store session data in local
app.use((req,res,next)=>{
    res.locals.user=req.session.user;
    next();
})

// Set up middleware to store base URL
app.use((req, res, next) => {
    res.locals.baseUrl = `${req.protocol}://${req.get('host')}`;
    res.locals.current_url = `${req.protocol}://${req.get('host')}${req.originalUrl}`;
    next();
});


//set templet engine to ejs
app.set('view engine', 'ejs');

// Expose helpers globally to EJS templates
app.use(async (req, res, next) => 
{
    if(req.session.user)
    {
        const sidebarItems = await helpers.getUserMenu(req.session.user);
        res.locals.sidebarItems = sidebarItems; 
        next();
    }
    else
    {
        next();
    }
   
})



// auth route
app.use('', require('./routes/authRoute'));
// roll route
app.use('/admin/roll', require('./routes/rollRoute'));
// user route
app.use('/admin/user', require('./routes/userRoute'));
// module route
app.use('/admin/module', require('./routes/moduleRoute'));
//sub module route
app.use('/admin/submodule', require('./routes/subModuleRoute'));


//require('./job/scheduler');


app.listen(port, () => {
    console.log(`Server Running http://localhost:${port}`);
})