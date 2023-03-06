require("dotenv").config();
const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const mongoose = require('mongoose');
const passport = require('passport');
const flash = require('connect-flash');
const session = require('express-session');

const methodOverride = require("method-override");

const app = express();

// Passport Config (local)
require('./config/passport')(passport);

// Passport Config (Google OAuth 2.0)
// require("./config/passport-oauth-google")(passport);

// Connect to MongoDB
mongoose
  .connect(
    process.env.MONGO_URI,
    { useNewUrlParser: true ,useUnifiedTopology: true, useFindAndModify: false}
  )
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));

// EJS
app.use(express.static("public"));
app.use(expressLayouts);
app.set('view engine', 'ejs');

// Express body parser
app.use(express.urlencoded({ extended: true }));

// Express session
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: false
  })
);

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Connect flash
app.use(flash());

// Global variables
app.use(function(req, res, next) {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  next();
});

// Method Overriding
app.use(methodOverride("_method"));

// Routes
// app.use('/', require('./routes/index.js'));
app.use('/users', require('./routes/users.js'));

// Home
app.use('/home', require('./routes/home.routes'));

// Book
app.use('/book', require('./routes/book.routes'));

// Packages
app.use('/packages', require('./routes/packages.routes.js'));

// Services
app.use('/services', require('./routes/services.routes.js'));

// Gallery
app.use('/gallery', require('./routes/gallery.routes.js'));

// Review
app.use('/review', require('./routes/review.routes.js'));

// Contact
app.use('/contact', require('./routes/contact.routes.js'));


app.use('*', (req, res) => {
    res.status(200).json({
        success: true,
        message: "Welcome to Tour & Travels",
        data: "Welcome to Tour & Travels"
    });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, console.log(`Server running on  ${PORT}`));
