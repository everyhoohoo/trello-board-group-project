const express = require('express');
const ensureLoggedIn = require("connect-ensure-login").ensureLoggedIn();
var stripe = require("stripe")("sk_test_WbaOYTjHJs8ePslGcVzuZU92");
var rp = require("request-promise");
var router = express.Router();

router.get("/", ensureLoggedIn, function(req, res, next) {
	var customerId = req.user.app_metadata.stripe_customer_id;
	router.post('/charge', (req, res) => { 
    let amount = 999;

    // stripe.customer.create({
    //   email:req.body.stripeEmail,
    //   source: req.body.stripeToken
    })
      stripe.charges.create({
        amount,
        description: "sample charge",
        currency: "usd",
        customer: customerId
      })
    .then(charge => res.redirect('/boards'))
	};
	

// 			console.log(response);
// 			//userPF = response;
// 			res.render("board", {
// 				board_id: boardID
// 			});
// 		})
// 		.catch(function(err) {
// 			console.log("payment not good!");
// 			res.render("user", {
// 				user: req.user
// 			});
// 		});
// });

// Token is created using Checkout or Elements!
// Get the payment token ID submitted by the form:
// const token = request.body.stripeToken; // Using Express

// const charge = stripe.charges.create({
//   amount: 999,
//   currency: 'usd',
//   description: 'Example charge',
//   source: token,
//   receipt_email: 'jenny.rosen@example.com',
// });

// module.exports = router;


