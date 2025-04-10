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

    const legalMoves = getLegalMoves(selectedPiece, fromRow, fromCol);
    const isLegalMove = legalMoves.some(([r, c]) => r === row && c === col);
    // Si es un movimiento legal se mueve la pieza
    if(isLegalMove){
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

function isSameColorFromColor(color, piece){
  if(!piece) return false;
  return (color === 'white' && piece === piece.toUpperCase()) ||
          (color === 'black' && piece === piece.toLowerCase());
}

function getLegalMoves(piece, row, col){
  switch(piece){

    case 'P':
      return getWhitePawnMoves(row, col);
    
    case 'p':
      return getBlackPawnMoves(row, col);
    
    case 'H':
      return getKnightMoves(row, col, 'white');
    
    case 'h':
      return getKnightMoves(row, col, 'black');
    
    case 'B':
      return getBishopMoves(row, col, 'white');
    
    case 'b':
      return getBishopMoves(row, col, 'black');
    
    default:
      return [];
  }
}

function getWhitePawnMoves(row, col){
  const moves = [];

  //Una casilla hacia adelante
  if(isEmpty(row -1, col)){
    moves.push([row - 1, col]);

    //desde la fila inicial puede mover 2 casillas
    if(row === 6 && isEmpty(row - 2, col)){
      moves.push([row -2, col]);
    }
  }

  //Capturas en diagonal
  if(isEnemy(row -1, col - 1, 'white')){
    moves.push([row - 1, col - 1]);
  }
  if(isEnemy(row - 1, col + 1, 'white')){
    moves.push([row - 1, col + 1])
  }

  return moves;
}

function getBlackPawnMoves(row, col){
  const moves = [];

  //casilla hacia adelante
  if(isEmpty(row + 1, col)){
    moves.push([row + 1, col]);

    //desde la fila inicial puede mover 2 casillas
    if(row === 1 && isEmpty(row + 2, col)){
      moves.push([row + 2, col]);
    }
  }
  //Capturas en diagonal
  if(isEnemy(row + 1, col - 1, 'black')){
    moves.push([row + 1, col - 1]);
  }
  if(isEnemy(row + 1, col + 1, 'black')){
    moves.push([row + 1, col + 1]);
  }

  return moves;
}

function getKnightMoves(row, col, color){
  const moves = [];
  const offsets = [
    [-2, -1], [-2, +1],
    [-1, -2], [-1, +2],
    [+1, -2], [+1, +2],
    [+2, -1], [+2, +1],
  ];

  for(const [dirX, dirY] of offsets){
    const r = row + dirX;
    const c = col + dirY;

    if(!isInsideBoard(r, c)) continue;

    const target =  boardState[r][c];
    if(!target || !isSameColorFromColor(color, target)){
      moves.push([r, c]);
    }
  }

  return moves;
}

function getBishopMoves(row, col, color){
  const moves = [];

  const directions = [
    [-1, -1], // ↖
    [-1, +1], // ↗
    [+1, -1], // ↙
    [+1, +1]  // ↘
  ];

  for(const [dirX, dirY] of directions){
    let r = row + dirX;
    let c = col + dirY;

    while(isInsideBoard(r, c)){
      const target = boardState[r][c];

      if(!target){
        moves.push([r, c]);
      }
      else if(!isSameColorFromColor(color, target)){
        moves.push([r, c]);//puede capturar enemigo
        break;
      }
      else{
        break;// mismo color, no puede avanzar mas en esa dirección
      }
      r += dirX;
      c += dirY;
    }
  }
  return moves;
}
function isInsideBoard(row, col){
  return row >= 0 && row < 8 && col >= 0 && col < 8;
}

function isEmpty(row, col){
  return isInsideBoard(row, col) && boardState[row][col] === '';
}

function isEnemy(row, col, color){
  const piece = boardState[row][col];
  if(!isInsideBoard(row, col) || !piece) return false;

  if(color === 'white'){
    return piece === piece.toLowerCase();//es negra
  }
  else{
    return piece === piece.toUpperCase();//es blanca
  }
}
restartBtn.addEventListener('click', () => {
  boardState = JSON.parse(JSON.stringify(initialBoard));
  currentTurn = 'white';
  selectedSquare = null;
  createBoard();
})

createBoard();
