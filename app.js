const express = require("express");
const path = require('path')
const dotenv = require("dotenv");
const morgan = require('morgan');
const session = require('express-session')
const exphbs = require('express-handlebars');
const connectDB = require('./config/db');
const passport = require('passport')

// Load config
dotenv.config({ path: './config/config.env' });

require('./config/passport')(passport)

connectDB();

const app = express();

// Logging
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

// Configure Handlebars
app.engine('.hbs', exphbs({ extname: '.hbs' }));
app.set('view engine', '.hbs');

//Sessions
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false
}))

//passport middleware
app.use(passport.initialize())
app.use(passport.session())

// Static Folder
app.use(express.static(path.join(__dirname, 'public')))

// Routes
 app.use('/', require('./routes/index'))
 app.use('/auth', require('./routes/auth'))

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});

