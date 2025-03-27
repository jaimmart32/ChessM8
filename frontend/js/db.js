/* Este archivo se encarga de simular la base de datos en localStorage 
    dado que todavia no hay servidor con base de datos*/

// Clave del diccionario de localStorage para la lista de usuarios
const DB_KEY = 'USER_DB';

// Recupera la lista de usuarios del local storage si la hay
export function getUserDB() {
    return JSON.parse(localStorage.getItem(DB_KEY)) || [];
}

// Guarda en localStorage la lista de usuarios
export function saveUserDB(userDB) {
    localStorage.setItem(DB_KEY, JSON.stringify(userDB));
}

// Busca a un usuario mediante el email para comprobar en el login que "esta registrado"
export function findUserByEmail(email) {
    return getUserDB().find(user => user.email === email)
}

// Añade una instancia de la clase User a la "base de datos" en localStorage.Estaria 
// bien que en el futuro se compruebe al registrarse si el email introducido ya esta 
// en la base de datos y que si el username ya esta cogido no se pueda registrar.
export function addUser(user) {
    const USER_DB = getUserDB();
    USER_DB.push(user);
    saveUserDB(USER_DB);
    console.log(`Usuario: ${user.username} se añadió a la base de datos.`);
}