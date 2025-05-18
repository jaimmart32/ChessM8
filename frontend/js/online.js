import { getCurrentUser } from "./db.js";
import { requireAuth } from "./authGuard.js";
import { Game } from "./classes/Game.js";
import { getAPIData } from "./fetch.js";

requireAuth();

const currentUser = getCurrentUser();
const createGameBtn = document.getElementById('create-game-btn');
const joinGameBtn = document.getElementById('join-game-btn');
const gameIdInput = document.getElementById('game-id-input');

// Crear partida
createGameBtn?.addEventListener('click', async () => {
    try {
        const gameData = new Game(currentUser._id, '')
        const result = await getAPIData('http://127.0.0.1:1337/api/games',
            'POST',
            JSON.stringify(gameData)
        );

        if(result && result._id) {
            alert(`Partida creada con éxito. ID: ${result._id}`);
            window.location.href = `online-game.html?id=${result._id}`;
        }
        else {
            alert('Error al crear partida.');
        }
    }
    catch (err) {
        console.error('Error al crear partida: ', err);
        alert('Hubo un error al crear la partida.');
    }
});

// Unirse a una partida
joinGameBtn?.addEventListener('click', async () => {
    const gameId = gameIdInput?.ariaValueMax?.trim();

    if(!gameId) {
        alert('Por favor, introduce un ID de partida');
        return;
    }

    try {
        // Verificar que el juego existe y no esta completo
        const gameData = await getAPIData(`http://127.0.0.1:1337/api/games/${gameId}`);

        if(!gameData || gameData.status !== 'waiting'){
            alert('La partida no existe o ya esta en curso');
            return;
        }

        // Actualizar la partida para añadir al player2
        gameData.playerBlack = currentUser._id;
        gameData.status = 'ongoing';

        const result = await getAPIData(`http://127.0.0.1:1337/api/games/${gameId}`,
            'PUT',
            JSON.stringify(gameData)
        );

        if(result) {
            alert('Te has unido a la partida correctamente.');
            window.location.href = `online-game.html?id=${gameId}`;
        }
        else {
            alert('No se pudo unir a la partida');
        }
    }
    catch (err) {
        console.error('Error al unirse a la partida: ', err);
        alert('Hubo un error al unirse a la partida')
    }
});