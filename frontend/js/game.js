import { requireAuth } from "./authGuard.js";

requireAuth();

const board = document.getElementById("board");
const turnIndicator = document.getElementById('turn-indicator');
const restartBtn = document.getElementById('restart-btn');

let currentTurn = 'white';
let selectedSquare = null;

// Posiciones iniciales usando emojis TODO: utilizar iconos en su lugar
const initialBoard = [
  ["r", "h", "b", "q", "k", "b", "h", "r"],
  ["p", "p", "p", "p", "p", "p", "p", "p"],
  ["", "", "", "", "", "", "", ""],
  ["", "", "", "", "", "", "", ""],
  ["", "", "", "", "", "", "", ""],
  ["", "", "", "", "", "", "", ""],
  ["P", "P", "P", "P", "P", "P", "P", "P"],
  ["R", "H", "B", "Q", "K", "B", "H", "R"]
];

// Asi se crea una deepcopy y no comparten referencias.
let boardState = JSON.parse(JSON.stringify(initialBoard));

function createBoard() {
  board.innerHTML = ''; // temporal, sustituiré por bucle

  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      const square = document.createElement('div');
      square.classList.add('square');
      const isWhite = (row + col) % 2 === 0;
      square.classList.add(isWhite ? 'white' : 'black');
      square.dataset.row = row;
      square.dataset.col = col;
      square.textContent = boardState[row][col];
      square.addEventListener('click', () => handleClick(square));
      board.appendChild(square);
    }
  }

  turnIndicator.textContent = `Turno: ${currentTurn === 'white' ? '♙ Blancas' : '♟ Negras'}`;
}

function handleClick(square) {

  const row = parseInt(square.dataset.row);
  const col = parseInt(square.dataset.col);
  const piece = boardState[row][col];

  if(selectedSquare){
    const fromRow = parseInt(selectedSquare.dataset.row);
    const fromCol = parseInt(selectedSquare.dataset.col);
    const selectedPiece = boardState[fromRow][fromCol];

    // Si se selecciona una casilla vacia o del contrario
    if(!piece || !isSameColor(selectedPiece, piece)){
      console.log('Dentro de seleccion de casilla vacia');
      boardState[row][col] = selectedPiece;
      boardState[fromRow][fromCol] = '';
      currentTurn = currentTurn === 'white' ? 'black' : 'white';
      selectedSquare = null;
      createBoard();
      return;
    }

    // Si seleciona una pieza del mismo color, cambia la seleccion
    selectedSquare.classList.remove('selected');
    selectedSquare = square;
    square.classList.add('selected');
    console.log('Se seleccionó una pieza del mismo color');
    return;
  }

  if(piece && isTurnCorrect(piece)){
    square.classList.add('selected');
    selectedSquare = square;
    console.log('Se seleccionó una pieza del color del turno correspondiente');
  }
}

function isTurnCorrect(piece){
  return (currentTurn === 'white' && piece === piece.toUpperCase()) ||
         (currentTurn === 'black' && piece === piece.toLowerCase());
}

function isSameColor(p1, p2){
  return (p1 === p1.toUpperCase() && p2 === p2.toUpperCase()) ||
         (p1 === p1.toLowerCase() && p2 === p2.toLowerCase());
}

restartBtn.addEventListener('click', () => {
  boardState = JSON.parse(JSON.stringify(initialBoard));
  currentTurn = 'white';
  selectedSquare = null;
  createBoard();
})

createBoard();
