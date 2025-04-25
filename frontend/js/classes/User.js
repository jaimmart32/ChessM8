//@ts-check

export class User {
    username;
    email;
    password;
    avatarUrl;
    createdAt;
    stats;

    /**
     * Constructor de la clase User.
     * @param {string} username - El nombre de usuario.
     * @param {string} email - El correo electrónico del usuario.
     * @param {string} password - La contraseña del usuario.
     * @param {string|null} [avatarUrl='assets/img/usuario.png'] - La URL de la imagen de perfil del usuario.
     * @throws {Error} - Si el username o el email están vacíos.
     */
    constructor(username, email, password, avatarUrl = null){
        this.username = username;
        this.email = email;
        this.password = password;
        this.avatarUrl = avatarUrl ||  'assets/img/usuario.png';
        this.createdAt = new Date().toISOString();
        this.stats = {
            wins: 0,
            losses: 0,
            draws: 0
        };
    }
}