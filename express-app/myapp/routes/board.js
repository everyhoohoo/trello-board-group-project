const express = require('express');
const passport = require('passport');
const ensureLoggedIn = require('connect-ensure-login').ensureLoggedIn();
const router = express.Router();
var rp = require('request-promise');

router.get('/board', function(req, res, next) {
    res.render('board');
});




module.exports = router;