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

let selectedSquare = null;

function createBoard() {
  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      const square = document.createElement('div');
      square.classList.add('square');
      const isWhite = (row + col) % 2 === 0;
      square.classList.add(isWhite ? 'white' : 'black');
      square.dataset.row = row;
      square.dataset.col = col;
      square.textContent = initialBoard[row][col];
      square.addEventListener('click', () => handleClick(square));
      board.appendChild(square);
    }
  }
}

function handleClick(square) {
  clearHighLights();

  const piece = square.textContent;
  const row = parseInt(square.dataset.row);
  const col = parseInt(square.dataset.col);

  if(piece !== "") {
    square.classList.add('selected');
    selectedSquare = square;
    simulateHighLights(row,col);
  }else {
    selectedSquare = null;
  }
}

function simulateHighLights(row, col) {
  const moves = [
    [row + 1, col],
    [row - 1, col],
    [row, col + 1],
    [row, col - 1]
  ];

  moves.forEach(([r, c]) => {
    if(r >= 0 && r < 8 && c >= 0 && c < 8) {
      const index = r * 8 + c;
      const square = board.children[index];
      square.classList.add('highlight');
    }
  });
}

function clearHighLights() {
  const squares = document.querySelectorAll('.square');
  squares.forEach(square => {
    square.classList.remove('highlight', 'selected');
  });
}

createBoard();
