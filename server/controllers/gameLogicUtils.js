function isLegalMove(board, fromRow, fromCol, toRow, toCol, color, hasMoved) {
  // Comprobar si es un movimiento dentro de los límites del tablero
  if (!isInsideBoard(fromRow, fromCol) || !isInsideBoard(toRow, toCol)) {
    return false;
  }
  
  const piece = board[fromRow][fromCol];
  const target = board[toRow][toCol];

  // Comprobar que haya una pieza
  if (!piece) return false;

  // Comprobar si se está intentando mover una pieza del color incorrecto
  if ((color === 'white' && piece !== piece.toUpperCase()) ||
      (color === 'black' && piece !== piece.toLowerCase())) {
    return false;
  }

  // Comprobar que no se está moviendo a una pieza propia
  if (target && isSameColorFromColor(color, target)) {
    return false;
  }

  // Obtener movimientos legales de la pieza en cuestión
  const legalMoves = getLegalMoves(piece, fromRow, fromCol, board, hasMoved);
  const isMoveIncluded = legalMoves.some(([r, c]) => r === toRow && c === toCol);
  if (!isMoveIncluded) return false;

  //Simular movimiento para comprobar que no se deja en jaque al rey
  const simulatedBoard = getUpdatedBoard(board, fromRow, fromCol, toRow, toCol);
  if (isKingInCheck(simulatedBoard, color)) {
    return false;
  }

  return true;
}

function getUpdatedBoard(board, fromRow, fromCol, toRow, toCol) {
  const newBoard = JSON.parse(JSON.stringify(board));
  newBoard[toRow][toCol] = newBoard[fromRow][fromCol];
  newBoard[fromRow][fromCol] = '';
  return newBoard;
}

function isKingInCheck(board, color) {
  const kingSymbol = color === 'white' ? 'K' : 'k';
  let kingPosition;

  // Buscar la posición del rey
  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      if (board[row][col] === kingSymbol) {
        kingPosition = [row, col];
        break;
      }
    }
  }

  if (!kingPosition) return false;

  // Comprobar si alguna pieza enemiga puede capturar al rey
  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      if (isEnemy(row, col, color, board)) {
        const legalMoves = getLegalMoves(board[row][col], row, col, board);
        if (legalMoves.some(([r, c]) => r === kingPosition[0] && c === kingPosition[1])) {
          return true;
        }
      }
    }
  }
  return false;
}

function isCheckMate(board, color) {
  // Recorremos todas las piezas del color actual
  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      const piece = board[row][col];
      if (piece && isSameColorFromColor(color, piece)) {
        const legalMoves = getLegalMoves(piece, row, col, board);

        for (const [r, c] of legalMoves) {
          const simulatedBoard = getUpdatedBoard(board, row, col, r, c);

          if (!isKingInCheck(simulatedBoard, color)) {
            return false; // Existe un movimiento que evita el jaque
          }
        }
      }
    }
  }
  return true;
}

// Funciones para determinar los movimientos legales de una pieza en particular
export function getLegalMoves(piece, row, col, board, hasMoved = null) {
  switch (piece) {
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
      return getKingMoves(row, col, 'white', board, hasMoved);
    case 'k':
      return getKingMoves(row, col, 'black', board, hasMoved);
    default:
      return [];
  }
}

// Movimientos legales de cada tipo de pieza

export function getWhitePawnMoves(row, col, board) {
  const moves = [];
  if (isEmpty(row - 1, col, board)) {
    moves.push([row - 1, col]);
    if (row === 6 && isEmpty(row - 2, col, board)) {
      moves.push([row - 2, col]);
    }
  }
  if (isEnemy(row - 1, col - 1, 'white', board)) {
    moves.push([row - 1, col - 1]);
  }
  if (isEnemy(row - 1, col + 1, 'white', board)) {
    moves.push([row - 1, col + 1]);
  }
  return moves;
}

export function getBlackPawnMoves(row, col, board) {
  const moves = [];
  if (isEmpty(row + 1, col, board)) {
    moves.push([row + 1, col]);
    if (row === 1 && isEmpty(row + 2, col, board)) {
      moves.push([row + 2, col]);
    }
  }
  if (isEnemy(row + 1, col - 1, 'black', board)) {
    moves.push([row + 1, col - 1]);
  }
  if (isEnemy(row + 1, col + 1, 'black', board)) {
    moves.push([row + 1, col + 1]);
  }
  return moves;
}

export function getKnightMoves(row, col, color, board) {
  const moves = [];
  const offsets = [
    [-2, -1], [-2, +1],
    [-1, -2], [-1, +2],
    [+1, -2], [+1, +2],
    [+2, -1], [+2, +1]
  ];

  for (const [dirRow, dirCol] of offsets) {
    const r = row + dirRow;
    const c = col + dirCol;
    if (isInsideBoard(r, c)) {
      const target = board[r][c];
      if (!target || !isSameColorFromColor(color, target)) {
        moves.push([r, c]);
      }
    }
  }

  return moves;
}

export function getBishopMoves(row, col, color, board) {
  const moves = [];
  const directions = [
    [-1, -1], [-1, +1],
    [+1, -1], [+1, +1]
  ];

  for (const [dirRow, dirCol] of directions) {
    let r = row + dirRow;
    let c = col + dirCol;

    while (isInsideBoard(r, c)) {
      const target = board[r][c];
      if (!target) {
        moves.push([r, c]);
      } else if (!isSameColorFromColor(color, target)) {
        moves.push([r, c]);
        break;
      } else {
        break;
      }
      r += dirRow;
      c += dirCol;
    }
  }
  return moves;
}

export function getRookMoves(row, col, color, board) {
  const moves = [];
  const directions = [
    [-1, 0], [+1, 0],
    [0, -1], [0, +1]
  ];

  for (const [dirRow, dirCol] of directions) {
    let r = row + dirRow;
    let c = col + dirCol;

    while (isInsideBoard(r, c)) {
      const target = board[r][c];
      if (!target) {
        moves.push([r, c]);
      } else if (!isSameColorFromColor(color, target)) {
        moves.push([r, c]);
        break;
      } else {
        break;
      }
      r += dirRow;
      c += dirCol;
    }
  }
  return moves;
}

export function getQueenMoves(row, col, color, board) {
  const diagonalMoves = getBishopMoves(row, col, color, board);
  const straightMoves = getRookMoves(row, col, color, board);
  return [...diagonalMoves, ...straightMoves];
}

export function getKingMoves(row, col, color, board, hasMoved) {
  const moves = [];
  const directions = [
    [-1, 0], [+1, 0],
    [0, -1], [0, +1],
    [-1, -1], [-1, +1],
    [+1, -1], [+1, +1]
  ];

  for (const [dirRow, dirCol] of directions) {
    const r = row + dirRow;
    const c = col + dirCol;
    if (isInsideBoard(r, c)) {
      const target = board[r][c];
      if (!target || !isSameColorFromColor(color, target)) {
        moves.push([r, c]);
      }
    }
  }

  if(hasMoved) {
    const castleMoves = getCastleMoves(color, board, hasMoved);
    moves.push(...castleMoves);    
  }

  return moves;
}

function getCastleMoves(color, board, hasMoved) {
  const row = color === 'white' ? 7 : 0;
  const moves = [];

  //Enroque corto
  if(!hasMoved[color].king && !hasMoved[color].rookRight){
    if(
      isEmpty(row, 5, board) &&
      isEmpty(row, 6, board) &&
      !isKingInCheck(board, color) &&
      !isKingInCheckAfterMove(board, row, 4, row, 5, color) &&
      !isKingInCheckAfterMove(board, row, 4, row, 6, color)
    ) {
      moves.push([row, 6]);
    }
  }

  //Enroque largo
  if(!hasMoved[color].king && !hasMoved[color].rookLeft){
    if(
      isEmpty(row, 3, board) &&
      isEmpty(row, 2, board) &&
      isEmpty(row, 1, board) &&
      !isKingInCheck(board, color) &&
      !isKingInCheckAfterMove(board, row, 4, row, 3, color) &&
      !isKingInCheckAfterMove(board, row, 4, row, 2, color)
    ) {
      moves.push([row, 2]);
    }
  }

  return moves;
}

//Comprobar jaques a la hora de enrocar
function isKingInCheckAfterMove(board, fromRow, fromCol, toRow, toCol, color){
  const simulatedBoard = simulateMove(board, fromRow, fromCol, toRow, toCol);
  return isKingInCheck(simulatedBoard, color);
}

//Simular el movimiento para validarlo en funcion de si deja en jaque al rey
function simulateMove(board, fromRow, fromCol, toRow, toCol) {
  //Deep copy del tablero
  const boardCopy = JSON.parse(JSON.stringify(board));

  //intercambiar casillas(realizar movimiento)
  boardCopy[toRow][toCol] = boardCopy[fromRow][fromCol];
  boardCopy[fromRow][fromCol] = '';

  return boardCopy;
}
// Funciones auxiliares
function isInsideBoard(row, col) {
  return row >= 0 && row < 8 && col >= 0 && col < 8;
}

function isEmpty(row, col, board) {
  return isInsideBoard(row, col) && board[row][col] === '';
}

function isSameColorFromColor(color, piece) {
  return (color === 'white' && piece === piece.toUpperCase()) ||
         (color === 'black' && piece === piece.toLowerCase());
}

function isEnemy(row, col, color, board) {
  const piece = board[row][col];
  if (!piece) return false;
  return (color === 'white' && piece === piece.toLowerCase()) ||
         (color === 'black' && piece === piece.toUpperCase());
}


export {
  isLegalMove,
  getUpdatedBoard,
  isKingInCheck,
  isCheckMate
};
