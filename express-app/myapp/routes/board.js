const express = require('express');
const passport = require('passport');
const ensureLoggedIn = require('connect-ensure-login').ensureLoggedIn();
const router = express.Router();
var rp = require('request-promise');

<<<<<<< HEAD
/* GET user profile. */
router.get('/', ensureLoggedIn, function(req, res, next) {
  res.render('board');
});
=======
router.get('/board', function(req, res, next) {
    res.render('board');
});



>>>>>>> 223f16b04344b2ee01052c7c269a92a9d77d2dcb

module.exports = router;