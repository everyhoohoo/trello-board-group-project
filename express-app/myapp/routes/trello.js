var express = require('express');
var router = express.Router();

/* GET trello board. */
router.get('/', function(req, res, next) {
  res.render('trello', { title: 'Trello Board' });
});

module.exports = router;