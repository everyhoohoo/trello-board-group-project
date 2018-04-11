// $(document).ready(function() {
//
//     renderEXBoards(userid);
//
//     var boardIDSL;
//
//     $('#createBoard').on('click', function () {
//         var boardName = prompt('Name of new board');
//         console.log(boardName);
//         if (boardName === null) {
//             return;
//         }
//         var id = getNewId();
//         addBoardCard(id, userid, boardName);
//         saveBoard({board_id: id, user_id: userid, name: boardName});
//
//         boardIDSL = id;
// });
//
// function renderEXBoards(userID) {
//     $.ajax({
//         method: "GET",
//         url: "http://localhost:8080/boards/"+ userID,
//
//     })
//         .done(function(boards) {
//             console.log(boards);
//
//             for (var i = 0; i < boards.length; i++) {
//                 var board = boards[i];
//                 addBoardCard(board.board_id, userid, board.name);
//             }
//         });
// }
//
// function addBoardCard (id, userID, boardName) {
//     var newBoardCard = $('<div class="boardName"><button class="userboards"><a href="./board">' + boardName + '</a></button></div>');
//     $('.w3-container').append(newBoardCard);
// }