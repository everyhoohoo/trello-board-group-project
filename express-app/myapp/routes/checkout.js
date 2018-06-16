const express = require('express');
const passport = require('passport');
const ensureLoggedIn = require('connect-ensure-login').ensureLoggedIn();
const router = express.Router();
var rp = require('request-promise');

/*After logging in you will be redirected here.*/
router.get('/', ensureLoggedIn, function(req, res, next) {
    var userPF;
    var userID = req.user.user_id;
    var userCheck = {
        method: 'GET',
        uri: 'http://localhost:8080/users/paid',
        //json: true,
        qs: {"user_id": userID},
        headers: {}
    };
    rp(userCheck)
        .then(function (response){
            /*Checks if user that logged in has paid, if not render checkout.jade for user to pay.*/
            console.log("USer id is : "+ userID);
            console.log("1. This is the response " + response.length);
            if(response.length === 23){
                console.log("2. Same response " + response);
                res.render('checkout');
            }
            else{
                /*If they have redirect to user.js*/
                console.log("3. Still the same " + response);
                res.redirect('/user')
            }

        })
        .catch(function (err){
            /*Creates user and adds them to our database.*/
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