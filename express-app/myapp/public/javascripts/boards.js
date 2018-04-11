$(document).ready(function() {
    renderEXBoards(userid);

    var boardIDSL;

    $('#createBoard').on('click', function () {
        var boardName = prompt('Name of new board');
        console.log(boardName);
        if (boardName === null) {
            return;
        }
        var id = getNewId();
        addBoard(id, userid, boardName);
        saveBoard({board_id: id, user_id: userid, name: boardName});
    });

});

function renderEXBoards(userID) {
    $.ajax({
            method: "GET",
            url: "http://localhost:8080/boards/"+ userID,

        })
        .done(function(boards) {
            console.log(boards);

            for (var i = 0; i < boards.length; i++) {
                var board = boards[i];
                addBoard(board.board_id, userid, board.name);
                renderEXSwimlanes(board.board_id);
            }
    });
}

function getNewId() {
    var id;
    return id = ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c =>
        (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
  )
}

function addBoard (id, userID, boardName) {
    let newBoard = '<div style="text-align:center"><input class= "createSwimlane" type="button" value="Add Swimlane" click=""></input></div>';

    let container = $("<div>", { "class":"container", "id":id });
    var boardName = $('<div class="boardName">' + boardName + '</div>');
    $('.w3-container').append(boardName, newBoard, container);
}