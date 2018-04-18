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

var UserProfile = sql.define('user', {
  user_id:{ type: Sequelize.STRING, primaryKey: true,},
});

var TrelloBoards = sql.define('board', {
  board_id:{ type: Sequelize.UUID, primaryKey: true, defaultValue: Sequelize.UUIDV4 },
  user_id:{ type: Sequelize.STRING,},
  name:{ type: Sequelize.STRING,}
});

//Columnlane is the same as a swimlane
var Columnlane = sql.define('swimlane', {
  id: { type: Sequelize.UUID, primaryKey: true, defaultValue: Sequelize.UUIDV4 },
  board_id: { type: Sequelize.UUID, defaultValue: Sequelize.UUIDV4},
  name: { type: Sequelize.STRING }
});

//RowCells is the same as a card
var RowCells = sql.define('card', {
  id: { type: Sequelize.UUID, primaryKey: true, defaultValue: Sequelize.UUIDV4 },
  swimlane_id: { type: Sequelize.UUID, defaultValue: Sequelize.UUIDV4 },
  title: { type: Sequelize.STRING },
  description: { type: Sequelize.STRING }
});

UserProfile.hasMany(TrelloBoards, {foreignKey: 'user_id', onDelete: 'CASCADE', onUpdate: 'CASCADE'});
TrelloBoards.hasMany(Columnlane, {foreignKey: 'board_id', onDelete: 'CASCADE', onUpdate: 'CASCADE'});
Columnlane.hasMany(RowCells, {foreignKey: 'swimlanes', onDelete: 'CASCADE', onUpdate: 'CASCADE'});

sql.sync();

function getHomePage(req, res, next) {
	res.send("This is just a plain boring HomePage.");
}

var Swimlane = function (id, board_id, name) {

  this.id = id;
  this.board_id = board_id;
  this.name = name;

}

var User = function (user_id) {
  this.user_id = user_id;
}

var Board = function (board_id, user_id, name){
  this.board_id = board_id;
  this.user_id = user_id;
  this.name = name;
}

function getUsers(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*"); 
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  var userID = req.query.user_id;
  console.log("You are in getUsers " + userID);
  UserProfile.findAll({where: {user_id: userID}, order: [['createdAt', 'ASC']]}).then((users) => {
    if (users === undefined || users.length == 0){
      res.send(404);
    }
    else {
      res.send(users);
    }
  });
}

function postUsers(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");

  UserProfile.create({
    user_id: req.query.user_id,
  }).then((users) => {
    res.send(users);
  });

}

function getBoards(req, res, next){
  res.header("Access-Control-Allow-Origin", "*"); 
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  var userID = req.query.user_id;
  console.log("You are in getUsers " + userID);
  TrelloBoards.findAll({where: {user_id: userID}, order: [['createdAt', 'ASC']]}).then((users) => {
    // if (users === undefined || users.length == 0){
    //   res.send(404);
    // }
    // else {
      res.send(boards);
    // }
  });
}

function postBoards(req, res, next){
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");

  TrelloBoards.create({
    board_id: req.body.board_id,
    user_id: req.body.user_id,
    name: req.body.name
  }).then((boards) => {
    res.send(boards);
  });
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

  Columnlane.create({
    id: req.body.id,
    board_id: req.body.board_id,
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

  RowCells.create({
    id: req.body.id,
    swimlane_id: req.body.swimlane_id,
    title: req.body.title,
    description: req.body.description
  }).then((cards) => {
    res.send(cards);
  });
}

function getBoardsByUserId (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");

  console.log(req.params.user_id);
  
  var userid = req.params.user_id;

  var results = TrelloBoards.findAll({
    where: {
      user_id: userid
    }
  }).then((boards)=>{
      res.send(boards);
  });
}

function getSwimlanesByBoardId (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");

  console.log(req.params.board_id);
  
  var boardid = req.params.board_id;

  var results = Columnlane.findAll({
    where: {
      board_id: boardid
    }
  }).then((swimlanes)=>{
      res.send(swimlanes);
  });
}

function getCardsBySwimlaneId (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");

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

  var swimlaneid = req.params.swimlane_id;

  var newName = req.body.name;

  Columnlane.update({ name: newName }, { where: { id: swimlaneid }})
    .then((swimlanes)=>{
      res.send(swimlanes);
    });


}

function updateCardByCardId(req, res, next){
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");

  var cardID = req.params.cardId;
  var name = req.body.title;
  var des = req.body.description;
  
  RowCells.update({ title: name, description: des}, {where: { id: cardID}})
    .then((cards)=>{
      res.send(cards);
    });
}

function updateCardSWByCardId(req, res, next){
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");

  var cardID = req.params.cardId;
  var swimlaneID = req.body.swimlane_id;
  
  RowCells.update({ swimlane_id: swimlaneID}, {where: { id: cardID}})
    .then((cards)=>{
      res.send(cards);
    });
}

function getTrelloByUserBoard(req, res, next){
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");

  var userID = req.query.user_id;
  console.log('This is the userID '+ userID);
  var boardID = req.query.board_id;
  console.log('This is the boardID '+ boardID);

    TrelloBoards.findAll({where: {user_id: userID, board_id: boardID}, order: [['createdAt', 'ASC']]}).then((boards) => {
    if (boards === undefined || boards.length == 0){
      res.send(404);
    }
    else {
      res.send(boards);
    }
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
server.get('/users', getUsers);
server.get('/boards', getBoards);
server.get('/swimlanes', getSwimLanes);
server.get('/boards/:user_id', getBoardsByUserId);
server.get('/boards/:board_id/swimlanes', getSwimlanesByBoardId)
server.get('/swimlanes/:swimlane_id/cards', getCardsBySwimlaneId);
server.get('/cards', getCards);
server.get('/users/boards', getTrelloByUserBoard);

server.post('/users', postUsers);
server.post('/boards', postBoards);
server.post('/swimlanes', postSwimLanes);
server.post('/swimlanes/:swimlane_id', updateSwimlaneBySwimlaneId);
server.post('/cards', postCards);
server.post('/cards/:cardId', updateCardByCardId);
server.post('/swimlanes/cards/:cardId', updateCardSWByCardId);
server.opts('/swimlanes/cards/:cardId', function(req, res, next) {
    res.header('Access-Control-Allow-Methods', 'OPTIONS, POST, DELETE');
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.send(204);
    return next();
});

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