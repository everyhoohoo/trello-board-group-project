const express = require('express');
const passport = require('passport');
const ensureLoggedIn = require('connect-ensure-login').ensureLoggedIn();
const router = express.Router();
var rp = require('request-promise');

/* GET user profile. */
router.get('/', ensureLoggedIn, function(req, res, next) {
// insure that user exists
//if not create user
var userPF;
var userID = req.user.user_id;
var userCheck = {
  method: 'GET',
  uri: 'http://localhost:8080/users',
  qs: {"user_id": userID},
  headers: {}
};
rp(userCheck)
  .then(function (response){
    console.log(response);
    //userPF = response;

  })
  .catch(function (err){
    /*This was for before we had a checkout page, if user logging in somehow finds there way to this part of the code.
    then we have an issue to fix.*/
    console.log("User not found!")
    var postUser = {
      method: 'POST',
      uri: 'http://localhost:8080/users',
      qs: {"user_id": userID},
      headers: {}
    };
    rp(postUser)
      .then(function (response){
        console.log("User " + userID + " was added to database!");
        //userPF = response;
      })
      .catch(function(err){
        console.log("Something went wrong!");
      });

  });
  res.render('user', {
    user: req.user
  });
});

module.exports = router;
