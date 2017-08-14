var express = require('express');
var router = express.Router();
var csrf = require('csurf');
var passport = require('passport');
var csrfProtection = csrf();
router.use(csrfProtection);

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('shop/index', { title: 'Express' });
});

router.get('/user/register' ,(req ,res ,next)=>{
  let messages= req.flash('error');
    res.render('user/register',{csrfToken: req.csrfToken(), messages: messages, hasErrors: messages.length>0});
});

router.post('/user/register' ,passport.authenticate('local.register',{
    successRedirect: '/user/profile',
    failureRedirect: '/user/register',
    failureFlash: true
}));

router.get('/user/profile', (req, res, next)=>{
    res.render('user/profile');
});

module.exports = router;
