export class User {
    id;
    username;
    email;
    password;
    avatarUrl;
    createdAt;
    stats;

    constructor(username, email, password, avatarUrl = null){
        this.id = crypto.randomUUID();// usar autoincremento en producción con variable static??
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