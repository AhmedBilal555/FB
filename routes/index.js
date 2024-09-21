var express = require('express');
var router = express.Router();
const Usermodel = require('./users');
const localStrategy = require('passport-local');
const passport = require('passport');
const {body,validationResult}=require("express-validator");
passport.use(new localStrategy(Usermodel.authenticate()));

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    console.log('inside request')
    return next();
  } else {
    res.redirect("/login");
    console.log('inside redirect')
  }
}
router.get("/", function (req, res) {
  res.render("index",{errors:""});
});

router.get("/login", function (req, res) {
  res.render("login");
});

router.get("/profile", function (req, res) {
  Usermodel.findOne({
    username: req.session.passport.user
  }).then(function (user) {
    console.log(user)
    res.render("profile",{
      user
    });
  })

});
router.post('/submit',body("password").isLength({min:5}).withMessage('password should be of minimum 5 character'), function (req, res) {
  const errors=validationResult(req);
  if (!errors.isEmpty()){
    //return res.status(400).json({errors:errors.array()});
    res.render("index",{errors:errors.array()});
    console.log(errors.array());
  }
  const details = new Usermodel({
    name: req.body.name,
    email: req.body.email,
    username: req.body.username
  });
  Usermodel.register(details, req.body.password)
    .then(function (registerUser) {
      res.redirect('/profile');
    })
});
router.post('/loginSubmit', passport.authenticate('local',
  {
    successRedirect: '/profile',
    failureRedirect: '/login'

  }), function (req, res) {

  });
router.get('/logout', function (req, res) {
  req.logOut();
  res.redirect('/')
});


module.exports = router;
