import { db } from '../server.mongodb.js';

export async function handleCreateGame(req, res) {
    try {
        const newGame = req.body;
        const createdGame = await db.games.create(newGame);
        res.status(201).send(createdGame);
    }
    catch (err) {
        console.error('Error creando partida: ', err);
        res.status(500).send({ error: 'Error al crear la partida' });
    }
}

export async function handleGetGame(req, res) {
    try {
        const { id } = req.params;
        const game = await db.games.get(id);

        if(game){
            res.status(200).send(game);
        }
        else {
            res.status(404).send({ error: 'Partida no encontrada' });
        }
    }
    catch (err) {
        console.error('Error obteniendo partida: ', err);
        res.status(500).send({ error: 'Error al obtener la partida' });
    }
}

export async function handleUpdateGame(req, res) {
    try {
        const { id } = req.params;
        const updatedFields = req.body;

        const success = await db.games.update(id, updatedFields);
        if(success) {
            res.status(200).send({ message: 'Partida actualizada correctamente' });
        }
        else {
            res.status(404).send({ error: 'No se pudo actualizar la partida' });
        }
    }
    catch (err) {
        console.error('Error actualizando partida: ', err);
        res.status(500).send({ error: 'Error al actualizar la partida' });
    }
}

export async function handleDeleteGame(req, res) {
    try {
        const { id } = req.params;
        const success = await db.games.delete(id);

        if(success) {
            res.status(200).send({ message: 'Partida eliminada correctamente' });
        }
        else {
            res.status(404).send({ error: 'No se encontró la partida para eliminar' });
        }
    }
    catch (err) {
        console.error('Error eliminando partida: ', err);
        res.status(500).send({ error: 'Error al eliminar la partida' });
    }
}

export async function handleGetAvailableGames(req, res) {
    try {
        const availableGames = await db.games.getAvailableGames();
        res.status(200).send(availableGames);
    }
    catch (err) {
        console.error('Error boteniendo partidas disponibles: ', err);
        res.status(500).send({ error: 'Error al obtener las partidas disponibles' });
    }
}