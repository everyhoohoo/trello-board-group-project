var restify = require('restify');
var server = restify.createServer();
const Sequelize = require("sequelize");
const Op = Sequelize.Op;

server.use(restify.plugins.acceptParser(server.acceptable));
server.use(restify.plugins.queryParser());
server.use(restify.plugins.bodyParser());

// setup the mysql configuration
const sql = new Sequelize('trello', 'root', 'P@tches1238', {
  host: 'localhost',
  port: 3306,
  dialect: 'mysql',
  operatorsAliases: false,
  pool: {
    max: 5,
    min: 0,
    acuire: 30000,
    idle: 10000
  }
});

sql
  .authenticate()
  .then(() => {
    console.log("The connection was successful!");
  })
  .catch(err => {
    console.log("There was an error when connecting!");
  });

//Columnlane is the same as a swimlane
var Columnlane = sql.define('swimlane', {
  id: { type: Sequelize.UUID, primaryKey: true, defaultValue: Sequelize.UUIDV4 },
  name: { type: Sequelize.STRING }
});

//RowCells is the same as a card
var RowCells = sql.define('card', {
  id: { type: Sequelize.UUID, primaryKey: true, defaultValue: Sequelize.UUIDV4 },
  swimlane_id: { type: Sequelize.UUID, foreignKey: true, defaultValue: Sequelize.UUIDV4 },
  title: { type: Sequelize.STRING },
  description: { type: Sequelize.STRING }
});

sql.sync();

// let swimlanes = []
// let cards = []

function getHomePage(req, res, next) {
	res.send("This is just a plain boring HomePage.");
}

var Swimlane = function (id, name) {

  this.id = id;
  this.name = name;

}

function getSwimLanes(req, res, next) {
  // Resitify currently has a bug which doesn't allow you to set default headers
  // These headers comply with CORS and allow us to serve our response to any origin
  res.header("Access-Control-Allow-Origin", "*"); 
  res.header("Access-Control-Allow-Headers", "X-Requested-With");

 //find the appropriate data
  Columnlane.findAll({order:[ ['createdAt', 'ASC'] ]}).then((swimlanes) => {
    res.send(swimlanes);
  });
    //res.send(swimlanes);
}


function postSwimLanes(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  console.log(req.body);

 //  var swimlane = new Swimlane(req.body.id, req.body.name);

 //  swimlanes.push(swimlane);

 //  //save the new message to the collection
	// res.send(swimlane);
  Columnlane.create({
    id: req.body.id,
    name: req.body.name
  }).then((swimlanes) => {
    res.send(swimlanes);
  });

}

var Card = function (id, swimlane_id, title, description) {

  this.id = id;
  this.swimlane_id = swimlane_id;
  this.title = title;
  this.description = description;

}

function getCards(req, res, next) {
  // Resitify currently has a bug which doesn't allow you to set default headers
  // These headers comply with CORS and allow us to serve our response to any origin
  res.header("Access-Control-Allow-Origin", "*"); 
  res.header("Access-Control-Allow-Headers", "X-Requested-With");

 //find the appropriate data
  RowCells.findAll({order:[ ['createdAt', 'ASC'] ]}).then((cards)=>{
    res.send(cards);
  });
    //res.send(cards);
}

function postCards(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  console.log(req.body);

  // var card = new Card(req.body.id, req.body.swimlane_id, req.body.title, req.body.description);

  // cards.push(card);

  // //save the new message to the collection
  // res.send(card);

  RowCells.create({
    id: req.body.id,
    swimlane_id: req.body.swimlane_id,
    title: req.body.title,
    description: req.body.description
  }).then((cards) => {
    res.send(cards);
  });
}

function getCardsBySwimlaneId (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  
  // console.log(req.params)
  // var results = cards.filter(function(card){
  //   return card.swimlane_id == req.params.swimlane_id;
  // });
  // res.send(results);

  console.log(req.params.swimlane_id);
  
  var swimlaneid = req.params.swimlane_id;

  var results = RowCells.findAll({
    where: {
      swimlane_id: swimlaneid
    }
  }).then((cards)=>{
      res.send(cards);
  });
}

function updateSwimlaneBySwimlaneId(req, res, next){
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");

  // var swimlane_id = req.params.swimlane_id;

  // var name = req.body.name;

  // var swimlane = swimlanes.find(function (swimlane){
  //   return swimlane.id == swimlane_id;
  // });
 
  // swimlane.name = name;

  // res.send(swimlane);
  var swimlaneid = req.params.swimlane_id;

  var newName = req.body.name;

  Columnlane.update({ name: newName }, { where: { swimlane_id: swimlaneid }})
    .then((swimlanes)=>{
      res.send(swimlanes);
    });


}

function updateCardByCardId(req, res, next){
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  // var cardId = req.params.cardId;
  // var name = req.body.title;
  // var description = req.body.description;

  // var card = cards.find(function (card){
  //   return card.id == cardId;
  // });

  // card.title = name;
  // card.description = description;

  // res.send(card);
  var cardID = req.params.cardId;
  var name = req.body.title;
  var des = req.body.description;
  
  RowCells.update({title: name, description: des}, {where: { id: cardID}})
    .then((cards)=>{
      res.send(cards);
    });
}

function deleteSwimlane(req, res, next){
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  var delSwimlane = req.params.id;

  RowCells.destroy({
    where: {swimlane_id: delSwimlane}
  }).then(()=>{
    res.send();
  });

  Columnlane.destroy({
    where: {id: delSwimlane}
  }).then(()=>{
    res.send();
  });
  
}

function deleteCard(req, res, next){
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  var delCard = req.params.id;

  RowCells.destroy({
    where: {id: delCard}
  }).then(()=>{
    res.send();
  });
  
}

// Set up our routes and start the server

server.get('/swimlanes', getSwimLanes);
server.get('/swimlanes/:swimlane_id/cards', getCardsBySwimlaneId);
server.get('/cards', getCards);

server.post('/swimlanes', postSwimLanes);
server.post('/swimlanes/:swimlane_id', updateSwimlaneBySwimlaneId);
server.post('/cards', postCards);
server.post('/swimlanes/cards/:cardId', updateCardByCardId);

server.del('/swimlanes/:id', deleteSwimlane);
server.opts('/swimlanes/:id', function(req, res, next) {
    res.header('Access-Control-Allow-Methods', 'OPTIONS, POST, DELETE');
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.send(204);
    return next();
});
server.del('/swimlanes/:swimlane_id/cards', deleteSwimlane);
server.opts('/swimlanes/:swimlane_id/cards', function(req, res, next) {
    res.header('Access-Control-Allow-Methods', 'OPTIONS, POST, DELETE');
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.send(204);
    return next();
});

server.del('/cards/:id', deleteCard);
server.opts('/cards/:id', function(req, res, next) {
    res.header('Access-Control-Allow-Methods', 'OPTIONS, POST, DELETE');
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.send(204);
    return next();
});

server.listen(8080, function () {
  console.log('%s listening at %s', server.name, server.url);
});