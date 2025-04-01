import { User } from './classes/User.js';
import { addUser, findUserByEmail, findUserByUsername, checkPassword, setCurrentUser } from './db.js';
import { validateUsername, validateEmail, validatePassword } from './validate.js';

let registerForm = document.getElementById('register-form');
let loginForm = document.getElementById('login-form');

registerForm?.addEventListener('submit', onRegister);
loginForm?.addEventListener('submit', onLogin);

/**
 * Event handler for the register form submission.
 * It validates the input fields, checks for username and email availability,
 * creates a new user and adds it to the database.
 * Then, it alerts the user of the successful registration and redirects to
 * the login page.
 * @param {Event} event - The submit event of the register form.
 */
function onRegister(event) {
    event.preventDefault();

    let form = /** @type {HTMLFormElement} */ (event.target);
    let formData = new FormData(form);

    let username = formData.get('username')?.toString().trim();
    let email = formData.get('email')?.toString().trim();
    let password = formData.get('password')?.toString();

    if(!validateUsername(username)) return alert('Nombre de usuario invalido.');
    if(!validateEmail(email)) return alert('Email invalido.');
    if(!validatePassword(password)) return alert('Contraseña inválida.');

    if(username === undefined) return alert('Nombre de usuario no proporcionado');
    if(findUserByUsername(username)) return alert('Este username ya está registrado.');
    if(email === undefined) return alert('Email no proporcionado');
    if(password === undefined) return alert('Password no proporcionada');
    if(findUserByEmail(email)) return alert('Este email ya está registrado.');

    let newUser = new User(username, email, password);
    addUser(newUser);

    alert('Registro exitoso, puedes iniciar sesion!');
    window.location.href = 'login.html';
}

/**
 * Event handler for the login form submission.
 * It validates the input fields, checks if the user exists and the password is correct,
 * sets the current user and redirects to the profile page.
 * @param {Event} event - The submit event of the login form.
 */
function onLogin(event) {
    event.preventDefault();

    let form = /** @type {HTMLFormElement} */ (event.target);
    let formData = new FormData(form);

    let email = formData.get('email')?.toString().trim();
    let password = formData.get('password');

    let user = findUserByEmail(email);

    if(!user) return alert('No existe un usuario con ese email.');
    if(!checkPassword(user, password)) return alert('La contraseña introducida es incorrecta.');

    setCurrentUser(user);
    alert('Has iniciado sesion exitosamente!');
    window.location.href = 'profile.html';

}