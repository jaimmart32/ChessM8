import { User } from './classes/User.js';
import { addUser, findUserByEmail, findUserByUsername, checkPassword, setCurrentUser } from './db.js';
import { validateUsername, validateEmail, validatePassword } from './validate.js';

let registerForm = document.getElementById('register-form');
let loginForm = document.getElementById('login-form');

registerForm?.addEventListener('submit', onRegister);
loginForm?.addEventListener('submit', onLogin);

function onRegister(event) {
    event.preventDefault();

    let form = event.target;
    let formData = new FormData(form);

    let username = formData.get('username').trim();
    let email = formData.get('email').trim();
    let password = formData.get('password');

    if(!validateUsername(username)) return alert('Nombre de usuario invalido.');
    if(!validateEmail(email)) return alert('Email invalido.');
    if(!validatePassword(password)) return alert('Contraseña inválida.');

    if(findUserByUsername(username)) return alert('Este username ya está registrado.')
    if(findUserByEmail(email)) return alert('Este email ya está registrado.');

    let newUser = new User(username, email, password);
    addUser(newUser);

    alert('Registro exitoso, puedes iniciar sesion!');
    window.location.href = 'login.html';
}

function onLogin(event) {
    event.preventDefault();

    let form = event.target;
    let formData = new FormData(form);

    let email = formData.get('email').trim();
    let password = formData.get('password');

    let user = findUserByEmail(email);

    if(!user) return alert('No existe un usuario con ese email.');
    if(!checkPassword(user, password)) return alert('La contraseña introducida es incorrecta.');

    setCurrentUser(user);
    alert('Has iniciado sesion exitosamente!');
    window.location.href = 'profile.html';

}