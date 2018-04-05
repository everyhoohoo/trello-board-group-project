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
    userPF = response;
  })
  .catch(function (err){
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
        userPF = response;
      })
      .catch(function(err){
        console.log("Something went wrong!");
      });

  });


// var userPF;
// require("jsdom/lib/old-api").env("", function(err, window) {
//     if (err) {
//         console.error(err);
//         return;
//     }

//     var $ = require("jquery")(window);

// 	var userID = req.user.user_id;

// 	$.ajax({
// 		method: "GET",
// 		url: "http://localhost:8080/users",
//     	data: {"user_id": userID},
// 	}).fail(function(users) {
// 		$.ajax({
// 			method: "POST",
// 			url: "http://localhost:8080/users",
//     		data: {"user_id": userID},
// 		})
//         .done(function(users) {
//            	console.log("Saved User");
//         });
// 	}).done(function(users) {
// 		userPF = users;
// 	});

// });

//console.log(req.user);
  res.render('user', {

    user: { auth0: req.user,
    		local: userPF }
  });
});

module.exports = router;
