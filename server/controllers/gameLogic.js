import { db } from '../server.mongodb.js';
import { isLegalMove, getUpdatedBoard, isCheckMate, isKingInCheck } from './gameLogicUtils.js';

export async function handleMove(req, res) {
    try {
        const { gameId, fromRow, fromCol, toRow, toCol, playerId } = req.body;

        //Recuperar partida de la base de datos
        const game = await db.games.get(gameId);

        if(!game) {
            return res.status(404).json({ error: 'Partida no encontrada'});
        }

        //Comprobar turno
        const isWhiteTurn = game.turn === 'white';
        const isPlayerTurn = (isWhiteTurn && game.playerWhite === playerId) ||
            (!isWhiteTurn && game.playerBlack === playerId);
        
        if(!isPlayerTurn) {
            return res.status(403).json({ error: 'No es tu turno'});
        }

        //Comprobar si el movimiento es legal
        const legalMoves = isLegalMove(game.boardState, fromRow, fromCol, toRow, toCol, game.turn);
        
        if(!legalMoves) {
            return res.status(400).json({ error: 'Movimiento ilegal'});
        }

        //Actulaizar el estado del tablero y cambiar turno
        const newBoardState = getUpdatedBoard(game.boardState, fromRow, fromCol, toRow, toCol);
        const nextTurn = game.turn === 'white' ? 'black' : 'white';

        //Verificar si es jaque mate
        const isMate = isCheckMate(newBoardState, nextTurn);
        const isCheck = isKingInCheck(newBoardState, nextTurn);
        console.log('--------------------------FINAL DE TURNO---------------------');

        //Actualizar el estado del juego
        await db.games.update(gameId, {
            boardState: newBoardState,
            turn: nextTurn,
            status: isMate ? 'finished' : 'ongoing'
        });

        res.status(200).json({ boardState: newBoardState, turn: nextTurn, check: isCheck, mate: isMate });
    }
    catch (err) {
        console.error('Error al processar movimiento: ', err);
        res.status(500).json({ error: 'Error al procesar el movimiento'});
    }
}

export async function handleGetGameState(req, res) {
    try {
        const { id } = req.params;

        const game = await db.games.get(id);

        if(!game) {
            return res.status(404).json({ error: 'Partida no encontrada'});
        }

        res.status(200).json(game);
    }
    catch (err) {
        console.error('Error al recuperar el estado de la partida: ', err);
        res.status(500).json({ error: 'Error al recuperar el estado de la partida'});
    }
}

export async function handleSurrender(req, res) {
    try {
        const { id } = req.params;
        const { playerId } = req.body;

        const game = await db.games.get(id);
        if(!game) {
            return res.status(404).json({ error: 'Partida no encontrada' });
        }

        const isPlayerinGame = game.playerWhite === playerId || game.playerBlack === playerId;
        if(!isPlayerinGame) {
            return res.status(403).json({ error: 'No tienes permiso para rendirte en esta partida' });
        }

        await db.games.update(id, { status: 'finished' });
        res.status(200).json({ message: 'El jugador se ha rendido. Partida finalizada.' });
    }
    catch (err) {
        console.error('Error al rendirse: ', err);
        res.status(500).json({ error: 'Error al procesar la rendición' });
    }
}