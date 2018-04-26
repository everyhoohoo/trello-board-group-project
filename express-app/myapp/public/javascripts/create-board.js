$(document).ready(function() {
    renderEXBoards(userid);

    $("#createBoard").on("click", function() {
        var boardName = prompt("Name of new board");
        console.log(boardName);
        if (boardName === null) {
            return;
        }
        var id = getNewId();
        addBoardCard(id, userid, boardName);
        saveBoard({ board_id: id, user_id: userid, name: boardName });

        boardIDSL = id;
        return boardIDSL;
    });
});

var boardIDSL;

function getNewId() {
    var id;
    return (id = ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c =>
        (
            c ^
            (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))
        ).toString(16)
    ));
}

function renderEXBoards(userID) {
    $.ajax({
        method: "GET",
        url: "http://localhost:8080/boards/" + userID
    }).done(function(boards) {
        console.log(boards);

        for (var i = 0; i < boards.length; i++) {
            var board = boards[i];
            addBoardCard(board.board_id, userid, board.name);
        }
    });
}

function addBoardCard(id, userID, boardName) {
    var newBoardCard = $("<div>", { class: "userboards", id: id });

    var firstPart = "./board?id=";

    var boardUrl = firstPart + id;

    var boardName = $("<a href='" + boardUrl + "'>" + boardName + "</a>");

    var boardButtons = $('<span class = "buttons"><input class="fa-pencil-alt userboard-buttons" type="button" value="Edit" click=""></input><input class="userboard-buttons delBdBtn" type="button" value="Delete" click=""></input></span>');

    newBoardCard.append(boardName);
    newBoardCard.append(boardButtons);

    boardButtons.on("click", ".fa-pencil-alt", function() {
        var newName = prompt("Rename Board");
        if (newName === null) {
            return;
        }
        boardName.text(newName);
        updateBoard(id, newName);
    });

    boardButtons.on("click", ".delBdBtn", function() {
        var rm = $(this)
            .closest(".userboards")
            .attr("id");
        console.log(rm);
        $(this)
            .closest(".userboards")
            .remove();
        deleteBoard(rm);
    });

    $(".w3-container").append(newBoardCard);
}

function saveBoard(board) {
    $.ajax({
        method: "POST",
        url: "http://localhost:8080/boards",
        data: board
    }).done(function(board) {
        alert("Saved Board: " + board);
    });
}

function updateBoard(boardID, boardName) {
    $.ajax({
        method: "POST",
        url: "http://localhost:8080/boards/" + boardID,
        data: { name: boardName }
    }).done(function(board) {
        alert("Board Updated: " + board);
    });
}

function deleteBoard(boardID) {
    $.ajax({
        method: "DELETE",
        url: "http://localhost:8080/boards/" + boardID
    }).done(function(boards) {
        alert("All Board data, Swimlanes and Cards, were deleted.");
    });
}