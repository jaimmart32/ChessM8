import { User } from './classes/User.js';
import { addUser, findUserByEmail } from './db.js';
import { validateUsername, validateEmail, validatePassword } from './validate.js';

document.getElementById('register-form').addEventListener('submit', onRegister);

function onRegister(event) {
    event.preventDefault();

    let username = this.username.value.trim();
    let email = this.email.value.trim();
    let password = this.password.value;

    if(!validateUsername(username)) return alert('Nombre de usuario invalido.');
    if(!validateEmail(email)) return alert('Email invalido.');
    if(!validatePassword(password)) return alert('Contraseña inválida.');

    if(findUserByEmail(email)) return alert('Este email ya está registrado.');

    let newUser = new User(username, email, password);
    addUser(newUser);

    alert('Registro exitoso, puedes iniciar sesion!');
    window.location.href = 'login.html';
}