$(document).ready(function() {

    renderEXBoards(userid);

    $('#createBoard').on('click', function () {
        var boardName = prompt('Name of new board');
        console.log(boardName);
        if (boardName === null) {
            return;
        }
        var id = getNewId();
        addBoardCard(id, userid, boardName);
        saveBoard({board_id: id, user_id: userid, name: boardName});

        boardIDSL = id;
        return boardIDSL;
	});

});

var boardIDSL;

function getNewId() {
    var id;
    return id = ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c =>
        (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
  )
}

function renderEXBoards(userID) {
    $.ajax({
        method: "GET",
        url: "http://localhost:8080/boards/"+ userID,

    })
        .done(function(boards) {
            console.log(boards);

            for (var i = 0; i < boards.length; i++) {
                var board = boards[i];
                addBoardCard(board.board_id, userid, board.name);
            }
        });
}

function addBoardCard (id, userID, boardName) {
    var newBoardCard = $("<div>", { "class":"userboards", "id":id });

	var firstPart = "./board?id=";

    var boardUrl = firstPart + id;

    var boardName = $("<a href='"+boardUrl+"'>"+ boardName +"</a>");

	$(newBoardCard).append(boardName)

    $('.w3-container').append(newBoardCard);
}

function saveBoard(board) {
    $.ajax({
        method: "POST",
        url: "http://localhost:8080/boards",
        data: board
    })
        .done(function(board){
            alert("Saved Board: " + board);
        })
}