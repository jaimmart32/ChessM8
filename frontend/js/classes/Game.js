export class Game {
    id;
    playerWhite;
    playerBlack;
    winner;
    status;//terminada o en progreso
    moves;
    createdAt;
    endendAt;

    // En realidad hay atributos que no se van a inicializar al instanciar(moves,endedAt..)
    
    /**
     * Crea una instancia de la clase Game.
     * @param {string} id - La identificador unico de la partida.
     * @param {string} playerWhite - El identificador del usuario que juega con las blancas.
     * @param {string} playerBlack - El identificador del usuario que juega con las negras.
     * @param {string|null} winner - El identificador del usuario ganador o null si no ha terminado.
     * @param {string} status - El estado actual de la partida, puede ser 'ended' o 'inProgress'.
     * @param {Array<string>} moves - El array de movimientos realizados en la partida.
     * @param {string} createdAt - La fecha y hora en la que se cre  la partida.
     * @param {string|null} endendAt - La fecha y hora en la que se termin  la partida o null si no ha terminado.
     */
    constructor(id, playerWhite, playerBlack, winner, status, moves, createdAt, endendAt){
        this.id = id;
        this.playerWhite = playerWhite;
        this.playerBlack = playerBlack;
        this.winner = winner;
        this.status = status;
        this.moves = moves;
        this.createdAt = createdAt;
        this.endendAt = endendAt;
    }
}