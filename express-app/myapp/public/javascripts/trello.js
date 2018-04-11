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
        addBoardCard(id, userid, boardName);
        saveBoard({board_id: id, user_id: userid, name: boardName});

        boardIDSL = id;
    });



    $('.w3-container').on('click', '.createSwimlane', function () {
        var slName = prompt('Name of new swimlane');
        if (slName === null) {
            return;
        }
        var id = getNewId();
        addSwimLane(id, boardIDSL, slName);
        saveSwimLane({id: id, board_id: boardIDSL, name: slName});
    });
});

var newSLane;

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

function renderEXSwimlanes(boardId) {
    $.ajax({
            method: "GET",
            url: "http://localhost:8080/boards/"+ boardId +"/swimlanes",

        })
        .done(function(swimlanes) {
            console.log(swimlanes);

            for (var i = 0; i < swimlanes.length; i++) {
                var swimlane = swimlanes[i];
                addSwimLane(swimlane.id, boardid, swimlane.name);
                renderEXCards(swimlane.id);
            }
        });

}

function renderEXCards(swimlaneId) {

    $.ajax({
            method: "GET",
            url: 'http://localhost:8080/swimlanes/' + swimlaneId + '/cards',
        })
        .done(function(cards) {
            console.log(cards);

            for (var i = 0; i < cards.length; i++) {
                addCard(cards[i].id, swimlaneId, cards[i].title, cards[i].description);
            }
        });
}

function getNewId() {
    var id;
    return id = ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c =>
        (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
  )
}

function addBoardCard (id, userID, boardName) {
    let newBoardCard = $('<div class="boardName"><button class="userboards"><a href="./board">' + boardName + '</a></button></div>');
    $('.w3-container').append(newBoardCard);
}

function addBoard (id, userID, boardName) {
    let newBoard = '< style="text-align:center"><input class= "createSwimlane" type="button" value="Add Swimlane" click=""></input></>';

    let container = $("<div>", { "class":"container", "id":id });
    var boardName = $('<div class="boardName">' + boardName + '</div>');
    $('.w3-container').append(boardName, newBoard, container);
}

function addSwimLane(id, boardID, name) {

    newSLane = $("<div>", { "id": id, "class": "swimlane" });

    var slName = $('<div class="swimelaneName">' + name + '</div>');
    newSLane.append(slName);

    var laneButtons = $('<span class = "buttons"><input class= "addCardBtn" type="button" value="Add Card" click=""></input><i class="fas fa-pencil-alt icons"></i><input class="delBtn" type="button" value="X" click=""></input></span>');
    newSLane.append(laneButtons);

    laneButtons.on('click', '.delBtn', function() {
        var rm = $(this).closest('.swimlane').attr('id');
        console.log(rm);
        $(this).closest('.swimlane').remove();
        deleteSwimlane(rm);

    });

    laneButtons.on('click', '.fa-pencil-alt', function() {
        var newName = prompt('Rename swimlane');
        if (newName === null) {
            return;
        }
        slName.text(newName);
        updateSwimlane(id, newName);
    });

    laneButtons.on('click', '.addCardBtn', function() {
        var txtTitle = prompt("Name your card:");
        if (txtTitle === null) {
            return;
        }

        var txtDescription = prompt("Description of card:");
        if (txtDescription === null) {
            return;
        }

        var cardID = getNewId();
        addCard(cardID, id, txtTitle, txtDescription);
        saveCard({ id: cardID, swimlane_id: id, title: txtTitle, description: txtDescription });
    });

    $("#"+ boardID).append(newSLane);
};

function addCard(id, swimlaneID, title, description) {

    var card = $("<div>", { "class": "card", "id": id});
    var cardName = $('<div class="cardName">' + title + '</div>');

    card.append(cardName);

    var cardButtons = $('<span class = "buttons"></span>');

    var titleEditBtn = $('<span class="fa-layers" id="titleEditBtn"><i class="fas fa-edit"></i><span class="fa-layers-text fa-inverse" data-fa-transform="shrink-5 left-3">T</span>');

    cardButtons.append(titleEditBtn);

    var descEditBtn = $('<span class="fa-layers" id="descEditBtn"><i class="fas fa-edit"></i><span class="fa-layers-text fa-inverse" data-fa-transform="shrink-5 left-3">D</span>');
    cardButtons.append(descEditBtn);

    var delCardBtn = $('<input class = "delBtn" type="button" value="X" click=""></span>');
    cardButtons.append(delCardBtn);

    cardButtons.on('click', '.delBtn', function() {
        var closestCard = $(this).closest('.card').attr('id');
        $(this).closest('.card').remove();
        console.log(closestCard);
        deleteCard(closestCard);
        //removeCard(closestCard);
    });

    card.append(cardButtons);

    var cardDescription = $('<div class :"description">' + description + '</div>')
    card.append(cardDescription)

    cardButtons.on('click', '#titleEditBtn', function() {
        var newTitle = prompt("Rename your card:");
        if (newTitle === null) {
            return;
        }
        cardName.text(newTitle);
        updateCard(id, newTitle, description);
    });
    cardButtons.on('click', '#descEditBtn', function() {
        var newDescription = prompt("Edit Description:");
        if (newDescription === null) {
            return;
        }
        cardDescription.text(newDescription);
        updateCard(id,title, newDescription);
    });

    $("#" + swimlaneID).append(card);
};

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

function saveSwimLane(swimlane) {
    $.ajax({
            method: "POST",
            url: "http://localhost:8080/swimlanes",
            data: swimlane
        })
        .done(function(swimlane) {
            alert("Saved Swimlane: " + swimlane);
        });
}

function updateSwimlane(id, name) {
    $.ajax({
            method: "POST",
            url: "http://localhost:8080/swimlanes/" + id,
            data: { name: name }
        })
        .done(function(swimlane) {
            alert("Swimlane Updated: " + swimlane);
        });
}

function saveCard(card) {
    $.ajax({
            method: "POST",
            url: "http://localhost:8080/cards",
            data: card
        })
        .done(function(card) {
            alert("Card Saved: " + card);
        });
}

function updateCard(id, txtTitle, txtDescription) {
    $.ajax({
            method: "POST",
            url: "http://localhost:8080/swimlanes/cards/" + id,
            data: { title: txtTitle, description: txtDescription }
        })
        .done(function(card) {
            alert("Card Updated: " + card);
        });
}

function deleteSwimlane(slID){
        $.ajax({
            method: "DELETE",
            url: 'http://localhost:8080/swimlanes/'+ slID +'/cards/',
        })
        .done(function(swimlanes) {
            alert("Any Cards In Swimlane " + slID + " Were Deleted.");
        });
                $.ajax({
            method: "DELETE",
            url: 'http://localhost:8080/swimlanes/' + slID,
        })
        .done(function(swimlanes) {
            alert("Swimlane " + slID + " Deleted.");
        });


}

function deleteCard(cID) {
        $.ajax({
            method: "DELETE",
            url: "http://localhost:8080/cards/" + cID,
        })
        .done(function(card) {
            alert("Card " + cID + " Deleted.");
        });

}