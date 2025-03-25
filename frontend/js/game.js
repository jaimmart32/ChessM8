const board = document.getElementById("board");

// Posiciones iniciales usando emojis TODO: utilizar iconos en su lugar
const initialBoard = [
  ["♜", "♞", "♝", "♛", "♚", "♝", "♞", "♜"],
  ["♟", "♟", "♟", "♟", "♟", "♟", "♟", "♟"],
  ["", "", "", "", "", "", "", ""],
  ["", "", "", "", "", "", "", ""],
  ["", "", "", "", "", "", "", ""],
  ["", "", "", "", "", "", "", ""],
  ["♙", "♙", "♙", "♙", "♙", "♙", "♙", "♙"],
  ["♖", "♘", "♗", "♕", "♔", "♗", "♘", "♖"]
];

function createBoard() {
  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      const square = document.createElement("div");
      square.classList.add("square");
      const isWhite = (row + col) % 2 === 0;
      square.classList.add(isWhite ? "white" : "black");
      square.textContent = initialBoard[row][col];
      square.dataset.row = row;
      square.dataset.col = col;
      board.appendChild(square);
    }
  }
}

createBoard();
