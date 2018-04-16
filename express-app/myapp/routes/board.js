const express = require("express");
const passport = require("passport");
const ensureLoggedIn = require("connect-ensure-login").ensureLoggedIn();
const router = express.Router();
var rp = require("request-promise");

/* GET user profile. */
router.get("/", ensureLoggedIn, function(req, res, next) {
	var boardID = req.query.id;
	var userID = req.user.user_id;

	var userCheck = {
		method: "GET",
		uri: "http://localhost:8080/users/boards",
		qs: { user_id: userID,
			  board_id: boardID
		},
		headers: {}
	};
	rp(userCheck)
		.then(function(response) {
			console.log(response);
			//userPF = response;
			res.render("board", {
				board_id: boardID
			});
		})
		.catch(function(err) {
			console.log("Board not found!");
			res.render("user", {
				user: req.user
			});
		});
});

module.exports = router;