import { getAPIData } from "./fetch.js";
import { requireAuth } from "./authGuard.js";
import { getCurrentUser } from "./db.js";

requireAuth();

const board = document.getElementById('board');
const turnIndicator = document.getElementById('turn-indicator');
const surrenderBtn = document.getElementById('surrender-btn');

const currentUser = getCurrentUser();
const gameId = new URLSearchParams(window.location.search).get('id');

let gameState = null;
let selectedSquare = null;

// Polling para obtener el estado actualizado de la partida
setInterval(fetchGameState, 2000);

async function fetchGameState() {
    try {
        const data = await getAPIData(`http://127.0.0.1:1337/api/games/${gameId}/state`);
        gameState = data;
        renderBoard();
        updateTurnIndicator();

        if(gameState.status === 'finished') {
            alert('La partida ha terminado.');
            window.location.href = 'online.html';
        }
    }
    catch (err) {
        console.error('Error al obtener el estado de la partida: ', err);
    }
}

//Renderizar el tablero
function renderBoard() {
    board.innerHTML = '';
    for (let row = 0; row < 8; row++) {
        for (let col = 0; col < 8; col++) {
            const square = document.createElement('div');
            square.classList.add('square');
            const isWhite = (row + col) % 2 === 0;
            square.classList.add(isWhite ? 'white' : 'black');
            square.dataset.row = row;
            square.dataset.col = col;
            square.textContent = gameState.boardState[row][col];
            square.addEventListener('click', () => handleClick(square));
            board?.appendChild(square);
        }
    }
}

function updateTurnIndicator() {
    const turn = gameState.turn;
    turnIndicator.textContent = `Turno: ${turn === 'white' ? '♙ Blancas' : '♟ Negras'}`;
}

async function handleClick(square) {
    if(!gameState || gameState.status === 'finished') return;

    const row = parseInt(square.dataset.row);
    const col = parseInt(square.dataset.col);
    const piece = gameState.boardState[row][col];
    const playerTurn = isPlayerTurn();

    if(!playerTurn) return alert('No es tu turno.');

    if(selectedSquare) {
        const fromRow = parseInt(selectedSquare.dataset.row);
        const fromCol = parseInt(selectedSquare.dataset.col);

        console.log(`Intentando mover de (${fromRow}, ${fromCol}) a (${row}, ${col})`);
        try {
            const moveResult = await getAPIData(
                `http://127.0.0.1:1337/api/games/${gameId}/move`,
                'POST',
                JSON.stringify({
                    gameId,
                    fromRow,
                    fromCol,
                    toRow: row,
                    toCol: col,
                    playerId: currentUser._id
                })
            );

            if(moveResult.mate) {
                alert('¡Jaque mate!');
            }
            else if(moveResult.check) {
                alert('¡Jaque!');
            }

            // Actualizar localmente
            gameState.boardState = moveResult.boardState;
            gameState.turn = moveResult.turn;
            selectedSquare = null;
            renderBoard();
            updateTurnIndicator();
        }
        catch (err) {
            console.error('Movimiento ilegal o error: ', err);
            selectedSquare.classList.remove('selected');
            selectedSquare = null;
        }
        return;
    }

    // Seleccion de pieza propia
    const ownPiece =  isOwnPiece(piece);
    if(piece && ownPiece) {
        square.classList.add('selected');
        selectedSquare = square;
    }
}

function isPlayerTurn() {
    return (gameState.turn === 'white' && gameState.playerWhite === currentUser._id) ||
            (gameState.turn === 'black' && gameState.playerBlack === currentUser._id);
}

function isOwnPiece(piece) {
    return (gameState.turn === 'white' && piece === piece.toUpperCase()) || 
            (gameState.turn === 'black' && piece === piece.toLowerCase());
}
//Rendirse
surrenderBtn?.addEventListener('click', async () => {
    if(confirm('¿Seguro que quieres rendirte?')) {
        try {
            await getAPIData(`http://127.0.0.1:1337/api/games/${gameId}/surrender`, 'POST', JSON.stringify({
                playerId: currentUser._id})
            );
            alert('Te has rendido. Partida finalizada.');
            window.location.href = 'online.html';
        }
        catch (err) {
            console.error('Error al rendirse: ', err);
            alert('No se pudo rendir la partida.');
        }
    }
});

//Cargar estado inicial
fetchGameState();