const express = require('express');
const passport = require('passport');
const ensureLoggedIn = require("connect-ensure-login").ensureLoggedIn();
var stripe = require("stripe")("sk_test_KEY");
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

/*Routing for when user logs in*/
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

/*Routing for when user logs out*/
router.get('/logout', function(req, res) {
  req.logout();
  res.redirect('/');
});

/*Routing for callback for when a login is successful and not successful*/
router.get('/callback',
  passport.authenticate('auth0', {
    failureRedirect: '/failure'
  }),
  function(req, res) {
    res.redirect(req.session.returnTo || '/checkout');
  }
);

/*Routing for when theres an error or a page has not been found.*/
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