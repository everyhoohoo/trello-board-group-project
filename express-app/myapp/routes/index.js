const express = require('express');
const passport = require('passport');
const ensureLoggedIn = require("connect-ensure-login").ensureLoggedIn();
var stripe = require("stripe")("sk_test_mugLRsztRkawLMCl3KuoFy68");
var rp = require("request-promise");
const router = express.Router();

const env = {
  AUTH0_CLIENT_ID: 'x6cdAQRT0ecZm93G8aEoXvXwmorejhSk',
  AUTH0_DOMAIN: 'agilesharkboard.auth0.com',
  AUTH0_CALLBACK_URL: 'http://localhost:3000/callback'
};

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index');
});

router.get('/login', passport.authenticate('auth0', {
  clientID: env.AUTH0_CLIENT_ID,
  domain: env.AUTH0_DOMAIN,
  redirectUri: env.AUTH0_CALLBACK_URL,
  responseType: 'code',
  audience: 'https://' + env.AUTH0_DOMAIN + '/userinfo',
  scope: 'openid profile'}),
  function(req, res) {
    res.redirect("/checkout");
});

// router.post("/charge", ensureLoggedIn, function(req, res) {
//     var customerId = req.user.app_metadata.stripe_customer_id;
//     //var customerId = req.context.idToken;
//     // router.post("/charge", (req, res) => {
//     //     let amount = 999;
//     // });
//     var userPaid;
//     let amount = 999;
//     stripe.charges
//         .create({
//             amount,
//             description: "sample charge",
//             currency: "usd",
//             customer: customerId,
//             source: req.body.stripeToken
//         })
//         .then(charge => 
//             userPaid = {
//                 method: 'POST',
//                 uri: 'http://localhost:8080/users/paid',
//                 qs: {"user_id": userID},
//                 headers: {}
//             });
//             rp(userPaid)
//                 .then(function (response){
//                 console.log("User has paid!");
//                 if(response === true){
//                     res.redirect('/user')
//                 }
//                 else{
//                     console.log("Something went horribly wrong!");
//                     res.redirect('/checkout')
//                 }
//             })
//             .catch(function(err){
//                 console.log("Something went wrong!");
//             });
//             //res.redirect("/users"));
// });

router.get('/logout', function(req, res) {
  req.logout();
  res.redirect('/');
});

// router.get('/checkout', function(req, res, next) {
//     res.render('checkout');
// });

router.get('/callback',
  passport.authenticate('auth0', {
    failureRedirect: '/failure'
  }),
  function(req, res) {
    res.redirect(req.session.returnTo || '/checkout');
  }
);

router.get('/failure', function(req, res) {
  var error = req.flash("error");
  var error_description = req.flash("error_description");
  req.logout();
  res.render('failure', {
    error: error[0],
    error_description: error_description[0],
  });
});

module.exports = router;