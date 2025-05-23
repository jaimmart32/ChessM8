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

//struct para comprobar si se podría enrocar
let hasMoved = {
  white: {
    king: false,
    rookLeft: false,
    rookRight: false
  },
  black: {
    king: false,
    rookLeft: false,
    rookRight: false
  }
};

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
      square.textContent = getPieceSymbol(boardState[row][col]);
      square.addEventListener('click', () => handleClick(square));
      board.appendChild(square);
    }
  }

  turnIndicator.textContent = `Turno: ${currentTurn === 'white' ? '♙ Blancas' : '♟ Negras'}`;
}

function getPieceSymbol(letter) {
  const symbols = {
    'K': '♔',
    'Q': '♕',
    'R': '♖',
    'B': '♗',
    'H': '♘',
    'P': '♙',
    'k': '♚',
    'q': '♛',
    'r': '♜',
    'b': '♝',
    'h': '♞',
    'p': '♟',
  };
  return symbols[letter] || '';
}

function handleClick(square) {

  const row = parseInt(square.dataset.row);
  const col = parseInt(square.dataset.col);
  const piece = boardState[row][col];

  if(selectedSquare){
    const fromRow = parseInt(selectedSquare.dataset.row);
    const fromCol = parseInt(selectedSquare.dataset.col);
    const selectedPiece = boardState[fromRow][fromCol];

    //Comprobar que es una pieza del turno actual antes de moverla. De no hacerlo
    // se podria clickar una pieza del turno correspondiente, entrando en selectedSquare
    // y luego clickar en una del otro color para despues poder moverla cuando no es
    // su turno
    if(!isTurnCorrect(selectedPiece)) {
      selectedSquare.classList.remove('selected');
      selectedSquare = null;
      return;
    }

    const legalMoves = getLegalMoves(selectedPiece, fromRow, fromCol);
    const isLegalMove = legalMoves.some(([r, c]) => r === row && c === col);
    // Si es un movimiento legal se mueve la pieza
    if(isLegalMove){
      console.log('ES UN MOVIMIENTO LEGAL');
      //simular movimiento
      const simulatedBoard = simulateMove(fromRow, fromCol, row, col);

      //comprobar si se dejaria al rey en jaque
      const isInCheck = isKingInCheck(currentTurn, simulatedBoard);
      if(isInCheck){
        alert('El rey estaria en jaque tras el movimiento, movimiento inválido');
        return;
      }

      //comprobar si es un rey o una torre para invalidar futuros intentos de enroque
      if(selectedPiece.toUpperCase() === 'K'){
        hasMoved[currentTurn].king = true;

        //enroque corto(derecha)
        if(fromCol === 4 && col === 6 && fromRow === row){
          console.log('Realizando enroque corto...');
          //mover torre tambien
          boardState[row][5] = boardState[row][7];
          boardState[row][7] = '';
        }

        //enroque largo(izquierda)
        if(fromCol === 4 && col === 2 && fromRow === row){
          console.log('Realizando enroque largo...');
          //mover torre tambien
          boardState[row][3] = boardState[row][0];
          boardState[row][0] = '';
        }
      }
      else if(selectedPiece.toUpperCase() === 'R'){
        if(fromCol === 0) hasMoved[currentTurn].rookLeft = true;
        if(fromCol === 7) hasMoved[currentTurn].rookRight = true;
      }

      //movimiento valido, actualizar estado del tablero
      boardState[row][col] = selectedPiece;
      boardState[fromRow][fromCol] = '';

      //comprobar si un peon coronó
      if((selectedPiece === 'P' && row === 0) || (selectedPiece === 'p' && row === 7)){
        handlePromotion(row, col, currentTurn);
      }

      //Cambio de turno
      currentTurn = currentTurn === 'white' ? 'black' : 'white';
      selectedSquare = null;
      createBoard();

      //Verificar si el oponente esta en jaque tras el movimiento
      const opponentColor = currentTurn;
      if(isKingInCheck(opponentColor, boardState)){
        alert(`Jaque para las ${opponentColor === 'white' ? 'Blancas' : 'Negras'}!`);

        //Verificar si es jaque mate
        if(isCheckMate(opponentColor)){
          alert(`Jaque Mate! ${opponentColor === 'white' ? 'Negras' : 'Blancas'} ganan.`);
          board.innerHTML = '<h2>Partida finalizada</h2>';//Cambiar por limpiar childs y appendChild de h2
          return;
        }
      }
      return;
    }

    // Si seleciona una pieza del mismo color, cambia la seleccion
    selectedSquare.classList.remove('selected');
    selectedSquare = square;
    square.classList.add('selected');
    console.log('Se seleccionó una pieza del mismo color');
    return;
  }

  //se selecciona una pieza del turno corrspondiente
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

function getLegalMoves(piece, row, col, board = boardState){
  switch(piece){

    case 'P':
      return getWhitePawnMoves(row, col, board);
    
    case 'p':
      return getBlackPawnMoves(row, col, board);
    
    case 'H':
      return getKnightMoves(row, col, 'white', board);
    
    case 'h':
      return getKnightMoves(row, col, 'black', board);
    
    case 'B':
      return getBishopMoves(row, col, 'white', board);
    
    case 'b':
      return getBishopMoves(row, col, 'black', board);
    
    case 'R':
      return getRookMoves(row, col, 'white', board);
    
    case 'r':
      return getRookMoves(row, col, 'black', board);
    
    case 'Q':
      return getQueenMoves(row, col, 'white', board);
    
    case 'q':
      return getQueenMoves(row, col, 'black', board);
    
    case 'K':
      return getKingMoves(row, col, 'white', board);
    
    case 'k':
      return getKingMoves(row, col, 'black', board);

    default:
      return [];
  }
}

function getKingMoves(row, col, color, board = boardState) {
  const moves = [];

  const directions = [
    [-1, 0],  // ↑
    [+1, 0],  // ↓
    [0, -1],  // ←
    [0, +1],  // →
    [-1, -1], // ↖
    [-1, +1], // ↗
    [+1, -1], // ↙
    [+1, +1]  // ↘
  ];

  for(const [dirRow, dirCol] of directions){
    const r = row + dirRow;
    const c = col + dirCol;

    if(!isInsideBoard(r, c)) continue;

    const target = board[r][c];
    if(!target || !isSameColorFromColor(color, target)){
      moves.push([r, c]);
    } 
  }

  // Añadir enroques posibles
  const castleMoves = getCastleMoves(color);
  moves.push(...castleMoves);

  return moves;
}

function getWhitePawnMoves(row, col, board = boardState){
  const moves = [];

  //Una casilla hacia adelante
  if(isEmpty(row -1, col, board)){
    moves.push([row - 1, col]);

    //desde la fila inicial puede mover 2 casillas
    if(row === 6 && isEmpty(row - 2, col, board)){
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

function getBlackPawnMoves(row, col, board = boardState){
  const moves = [];

  //casilla hacia adelante
  if(isEmpty(row + 1, col, board)){
    moves.push([row + 1, col]);

    //desde la fila inicial puede mover 2 casillas
    if(row === 1 && isEmpty(row + 2, col, board)){
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

function getKnightMoves(row, col, color, board = boardState){
  const moves = [];
  const offsets = [
    [-2, -1], [-2, +1],
    [-1, -2], [-1, +2],
    [+1, -2], [+1, +2],
    [+2, -1], [+2, +1],
  ];

  for(const [dirRow, dirCol] of offsets){
    const r = row + dirRow;
    const c = col + dirCol;

    if(!isInsideBoard(r, c)) continue;

    const target =  board[r][c];
    if(!target || !isSameColorFromColor(color, target)){
      moves.push([r, c]);
    }
  }

  return moves;
}

function getBishopMoves(row, col, color, board = boardState){
  const moves = [];

  const directions = [
    [-1, -1], // ↖
    [-1, +1], // ↗
    [+1, -1], // ↙
    [+1, +1]  // ↘
  ];

  for(const [dirRow, dirCol] of directions){
    let r = row + dirRow;
    let c = col + dirCol;

    while(isInsideBoard(r, c)){
      const target = board[r][c];

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
      r += dirRow;
      c += dirCol;
    }
  }
  return moves;
}

function getRookMoves(row, col, color, board = boardState) {
  const moves = [];

  const directions = [
    [-1, 0], // ↑
    [+1, 0], // ↓
    [0, -1], // ←
    [0, +1]  // →
  ];

  for(const [dirRow, dirCol] of directions) {
    let r = row + dirRow;
    let c = col + dirCol;

    while(isInsideBoard(r, c)) {
      const target = board[r][c];

      if(!target) {
        moves.push([r, c]);
      }
      else if(!isSameColorFromColor(color, target)) {
        moves.push([r, c]);// Puede capturar al enemigo
        break;
      }
      else {
        break;// Mismo color, no puede avanzar mas en la direciion
      }
      r += dirRow;
      c += dirCol;
    }
  }

  return moves;
}

function getQueenMoves(row, col, color, board = boardState) {
  //Combinar movimientos legales de alfil y torre
  const diagonalMoves = getBishopMoves(row, col, color, board);
  const straightMoves = getRookMoves(row, col, color, board);

  //concatenar movimientos de ambos tipos
  return [...diagonalMoves, ...straightMoves];
}

function isInsideBoard(row, col){
  return row >= 0 && row < 8 && col >= 0 && col < 8;
}

function isEmpty(row, col, board = boardState){
  return isInsideBoard(row, col) && board[row][col] === '';
}

function isEnemy(row, col, color, board = boardState){
  const piece = board[row][col];
  if(!isInsideBoard(row, col) || !piece) return false;

  if(color === 'white'){
    return piece === piece.toLowerCase();//es negra
  }
  else{
    return piece === piece.toUpperCase();//es blanca
  }
}

// COMPROBACION DE SI SE DEJARIA EL REY EN JAQUE CON UN MOVIMIENTO

//Encontrar la posicion del rey para saber si estaría en jaque
function findKingPosition(color, board) {
  const kingSymbol = color === 'white' ? 'K' : 'k';

  for(let row = 0; row < 8; row++){
    for(let col = 0; col < 8; col++){
      if(board[row][col] === kingSymbol){
        return [row, col];
      }
    }
  }
  return null;
}

//Comprobar si una posicion enemiga deja en jaque al rey
function isKingInCheck(color, simulatedBoard){
  const [kingRow, kingCol] = findKingPosition(color, simulatedBoard);

  for(let row = 0; row < 8; row++){
    for(let col = 0; col < 8; col++){
      const piece = simulatedBoard[row][col];
      if(piece && isEnemy(row, col, color, simulatedBoard)){
        const enemyMoves = getLegalMoves(piece, row, col, simulatedBoard);
        if(enemyMoves.some(([r, c]) => r === kingRow && c === kingCol)){
          return true;
        }
      }
    }
  }
  return false;
}

//Comprobar jaques a la hora de enrocar
function isKingInCheckAfterMove(fromRow, fromCol, toRow, toCol, color){
  const simulatedBoard = simulateMove(fromRow, fromCol, toRow, toCol);
  return isKingInCheck(color, simulatedBoard);
}

//Simular el movimiento para validarlo en funcion de si deja en jaque al rey
function simulateMove(fromRow, fromCol, toRow, toCol) {
  //Deep copy del tablero
  const boardCopy = JSON.parse(JSON.stringify(boardState));

  //intercambiar casillas(realizar movimiento)
  boardCopy[toRow][toCol] = boardCopy[fromRow][fromCol];
  boardCopy[fromRow][fromCol] = '';

  return boardCopy;
}

// JAQUE MATE
function isCheckMate(color) {
  for(let row = 0; row < 8; row++){
    for(let col = 0; col < 8; col++){
      const piece = boardState[row][col];
      if(piece && isSameColorFromColor(color, piece)){
        const legalMoves = getLegalMoves(piece, row, col);

        for(const [r, c] of legalMoves){
          //simulacion de movimiento
          const simulatedBoard = JSON.parse(JSON.stringify(boardState));
          simulatedBoard[r][c] = piece;
          simulatedBoard[row][col] = '';

          //si no esta en jaque tras el movimiento legal, no es jaque mate
          if(!isKingInCheck(color, simulatedBoard)){
            return false;
          }
        }
      }
    }
  }
  //si no hay movimiento legal posible tras el jaque, es jaque mate
  return true;
}

// MANEJO DE LA CORONACION DE UN PEON
function handlePromotion(row, col, color){
  //Crear selector de pieza
  const promotionDiv = document.createElement('div');
  promotionDiv.classList.add('promotion-container');

  const select = document.createElement('select');
  const options = ['Q', 'R', 'H', 'B'];

  options.forEach(piece => {
    const option = document.createElement('option');
    option.value = color === 'white' ? piece : piece.toLocaleLowerCase();
    option.textContent = getPieceName(option.value);
    select.appendChild(option);
  });

  const confirmButton = document.createElement('button');
  confirmButton.textContent = 'Coronar';
  confirmButton.addEventListener('click', () => {
    const pieceSelection = select.value;
    boardState[row][col] = pieceSelection;
    document.body.removeChild(promotionDiv);
    createBoard();
  });

  promotionDiv.appendChild(select);
  promotionDiv.appendChild(confirmButton);
  document.body.appendChild(promotionDiv);
}

function getPieceName(piece){
  switch(piece.toUpperCase()){
    
    case 'Q': return 'Dama';
    case 'R': return 'Torre';
    case 'H': return 'Caballo';
    case 'B': return 'Alfil';
    default: return 'Pieza';
  }
}

// MANEJO DE LOS MOVIMIENTOS DE ENROQUE
function getCastleMoves(color, board = boardState) {
  const row = color === 'white' ? 7 : 0;
  const moves = [];

  //Enroque corto
  if(!hasMoved[color].king && !hasMoved[color].rookRight){
    if(
      isEmpty(row, 5) &&
      isEmpty(row, 6) &&
      !isKingInCheck(color, board) &&
      !isKingInCheckAfterMove(row, 4, row, 5, color) &&
      !isKingInCheckAfterMove(row, 4, row, 6, color)
    ) {
      moves.push([row, 6]);
    }
  }

  //Enroque largo
  if(!hasMoved[color].king && !hasMoved[color].rookLeft){
    if(
      isEmpty(row, 3) &&
      isEmpty(row, 2) &&
      isEmpty(row, 1) &&
      !isKingInCheck(color, board) &&
      !isKingInCheckAfterMove(row, 4, row, 3, color) &&
      !isKingInCheckAfterMove(row, 4, row, 2, color)
    ) {
      moves.push([row, 2]);
    }
  }

  return moves;
}

//restablecer el estado del juego
function resetGameState() {
  boardState = JSON.parse(JSON.stringify(initialBoard));
  currentTurn = 'white';
  selectedSquare = null;

  hasMoved = {
    white: {
      king: false,
      rookLeft: false,
      rookRight: false
    },
    black: {
      king: false,
      rookLeft: false,
      rookRight: false
    }
  };  
}
restartBtn.addEventListener('click', () => {
  resetGameState();
  createBoard();
})

createBoard();
