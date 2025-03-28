/* Este archivo se encarga de simular la base de datos en localStorage 
    dado que todavia no hay servidor con base de datos*/

// Clave del diccionario de localStorage para la lista de usuarios
const DB_KEY = 'USER_DB';
// Clave para la "el token de sesion del usuario"
const SESSION_KEY = "CURRENT_USER";

// Recupera la lista de usuarios del local storage si la hay
export function getUserDB() {
    return JSON.parse(localStorage.getItem(DB_KEY)) || [];
}

// Guarda en localStorage la lista de usuarios
export function saveUserDB(userDB) {
    localStorage.setItem(DB_KEY, JSON.stringify(userDB));
}

// Busca a un usuario mediante el username para comprobar en el login que "esta registrado" y en el register que no esta registrado.
export function findUserByUsername(username) {
    return getUserDB().find(user => user.username === username);
}

// Busca a un usuario mediante el email para comprobar en el login que "esta registrado" y en el register que no esta registrado.
export function findUserByEmail(email) {
    return getUserDB().find(user => user.email === email);
}

// Comprueba que la contraseña introducida coincida con el email del usuario en la USER_DB
export function checkPassword(user, password) {
    if(!user) return false;
    if(user.password !== password) return false;
    return true;
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

/* FUNCIONES PARA LA SESION DEL USUARIO */

// Guarda al usuario como si fuese un token de sesion para manejar la sesion del usuario en concreto.
export function setCurrentUser(user) {
    localStorage.setItem(SESSION_KEY, JSON.stringify(user));
}

// Coge el "token de sesion" del localStorage.
export function getCurrentUser() {
    return JSON.parse(localStorage.getItem(SESSION_KEY));
}

// Elimina el "token de sesion" al hacer logout
export function clearCurrentUser() {
    localStorage.removeItem(SESSION_KEY);
}