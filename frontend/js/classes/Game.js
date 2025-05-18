
export class Game {
  /**
   * Crea una nueva instancia de Game
   * @param {string} playerWhite - ID o nombre del jugador con blancas
   * @param {string} playerBlack - ID o nombre del jugador con negras
   */
  constructor(playerWhite, playerBlack) {
    this.playerWhite = playerWhite; // ID o nombre del jugador con blancas
    this.playerBlack = playerBlack; // ID o nombre del jugador con negras
    this.boardState = this.initializeBoard(); // Estado del tablero
    this.turn = 'white'; // Turno actual
    this.status = 'waiting'; // Estado de la partida: 'ongoing', 'finished', 'waiting'
  }

  initializeBoard() {
    return [
      ["r", "h", "b", "q", "k", "b", "h", "r"],
      ["p", "p", "p", "p", "p", "p", "p", "p"],
      ["", "", "", "", "", "", "", ""],
      ["", "", "", "", "", "", "", ""],
      ["", "", "", "", "", "", "", ""],
      ["", "", "", "", "", "", "", ""],
      ["P", "P", "P", "P", "P", "P", "P", "P"],
      ["R", "H", "B", "Q", "K", "B", "H", "R"]
    ];
  }
}
