const express = require("express");
const ensureLoggedIn = require("connect-ensure-login").ensureLoggedIn();
var stripe = require("stripe")("sk_test_mugLRsztRkawLMCl3KuoFy68");
var rp = require("request-promise");
var router = express.Router();

router.post("/", ensureLoggedIn, function(req, res) {
    var userID = req.user.user_id;
    var userPaid = {
        method: "POST",
        uri: "http://localhost:8080/users/" + userID,
        qs: {},
        headers: {}
    };

    let amount = 999;

    stripe.customers
        .create({
            email: req.body.stripeEmail,
            source: req.body.stripeToken
        })
        .then(customer =>
            stripe.charges.create({
                amount,
                description: "Sample Charge",
                currency: "usd",
                customer: customer.id
            })
        )
        .then(charge =>
        rp(userPaid).then(function(response) {
            console.log("User has paid!");
            if (response === true) {
                res.redirect("/user");
            } else {
                console.log("Something went horribly wrong!");
                res.redirect("/checkout");
            }
        })
        .catch(function(err) {
            console.log("Something went wrong!");
        }));
});

module.exports = router;


