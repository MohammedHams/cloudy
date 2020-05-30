const authModel = require('../models/auth.model');
const validationResult = require('express-validator').validationResult;


exports.getIndex = (req,res,next) => {
  res.render('index');
}

exports.getLogin = (req, res, next) => {
    res.render('login', {
        authError : req.flash('authError')[0]
    })

}

exports.postLogin = (req, res, next) => {

  if (req.body.email == "admin" && req.body.password == "admin") {
      res.redirect('/index');

  } else {

     authModel.login(req.body.email, req.body.password)
      .then((id)=> {
          req.session.userId = id;
          res.redirect('/index');
      })
      .catch(err => {
          req.flash('authError' , err)
          res.redirect('/login');
      })
  }}

  exports.getSignup = (req, res, next) => {
    res.render('signup', {
        authError: req.flash('authError')[0],
        validationErrors: req.flash('validationErrors'),
        isUser: false,
        isAdmin: false
    })
}



exports.postSignup = (req, res, next) => {
    if (validationResult(req).isEmpty()) {
        authModel.createNewUser(req.body.username, req.body.email, req.body.password)
            .then(() => res.redirect('/login'))
            .catch(err => {
                req.flash('authError', err)
                res.redirect('/signup');
            })
    } else {
        req.flash('validationErrors', validationResult(req).array());
        res.redirect('/signup');
    }

};



exports.logout = (req, res, next) =>{
    req.session.destroy(() => {
        res.redirect('/login');
    });
}
