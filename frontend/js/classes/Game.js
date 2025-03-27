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