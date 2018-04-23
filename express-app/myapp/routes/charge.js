const express = require("express");
const ensureLoggedIn = require("connect-ensure-login").ensureLoggedIn();
var stripe = require("stripe")("sk_test_mugLRsztRkawLMCl3KuoFy68");
var rp = require("request-promise");
var router = express.Router();
/*Sends charge post to stripe account we created for the website.*/
router.post("/", ensureLoggedIn, function(req, res) {
    var userID = req.user.user_id;
    var userPaid = {
        method: "POST",
        uri: "http://localhost:8080/users/" + userID,
        qs: {},
        headers: {}
    };

    let amount = 999;
    /*Creates a stripe customer for the user that is currently logged in by getting the data they inputed in checkout.jade*/
    stripe.customers
        .create({
            email: req.body.stripeEmail,
            source: req.body.stripeToken
        })
        .then(customer =>
            /*Creates charge*/
            stripe.charges.create({
                amount,
                description: "Sample Charge",
                currency: "usd",
                customer: customer.id
            })
        )
        .then(charge =>
        rp(userPaid).then(function(response) {
            /*Changes stripe_paid to true in the user table stored in our database to prevent users from being charged again.*/
            console.log("User has paid!");
            if (response === true) {
                res.redirect("/user");
            } else {
                /*Something went bad and I have failed you.*/
                console.log("Something went horribly wrong!");
                res.redirect("/checkout");
            }
        })
        .catch(function(err) {
            console.log("Something went wrong!");
        }));
});

module.exports = router;


