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
        uri: 'http://localhost:8080/users/paid',
        qs: {"user_id": userID},
        headers: {}
    };
    rp(userCheck)
        .then(function (response){
            console.log("1. This is hopfully saying false or " + response);
            if(response === false){
                console.log("2. This is hopfully saying false or " + response);
                res.render('checkout');
            }
            else{
                console.log("3. It didn't work right." + response);
                res.redirect('/user')
            }

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
                    //userPF = response;
                    res.render('checkout');
                })
                .catch(function(err){
                    console.log("Something went wrong!");
                });

        });
});

module.exports = router;