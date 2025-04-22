import { User } from './classes/User.js';
import { setCurrentUser } from './db.js';
import { validateUsername, validateEmail, validatePassword } from './validate.js';
import { store } from './store/redux.js';
import { getAPIData } from './fetch.js';

let registerForm = document.getElementById('register-form');
let loginForm = document.getElementById('login-form');

registerForm?.addEventListener('submit', onRegister);
loginForm?.addEventListener('submit', onLogin);
// @ts-expect-error Hazte caso
window.addEventListener('stateChanged', (/** @type {CustomEvent}*/event) => {
    console.log('Cambio de estado en redux: ', event.detail);
})
/**
 * Event handler for the register form submission.
 * It validates the input fields, checks for username and email availability,
 * creates a new user and adds it to the database.
 * Then, it alerts the user of the successful registration and redirects to
 * the login page.
 * @param {Event} event - The submit event of the register form.
 */
async function onRegister(event) {
    event.preventDefault();

    const form = /**@type {HTMLFormElement}*/(event.target);
    const formData = new FormData(form);

    const username = formData.get('username')?.toString().trim();
    const email = formData.get('email')?.toString().trim();
    const password = formData.get('password')?.toString();

    const validations = [
        {valid: !!username, message: 'Nombre de usuario no proporcionado'},
        {valid: !!email, message:'Email no proporcionado'},
        {valid: !!password, message: 'Password no proporcionada'},
        {valid: validateUsername(username), message: 'Nombre de usuario inválido'},
        {valid: validateEmail(email), message: 'Email inválido'},
        {valid: validatePassword(password), message: 'Password inválida'},
        {valid: !store.user.getByUsername(/** @type {string} */(username)),  message: 'Este username ya está registrado'},
        {valid: !store.user.getByEmail(/** @type {string} */(email)), message: 'Este email ya está registrado'}
    ]

    for(const check of validations){
        if(!check.valid){
            alert(check.message);
            return;
        }
    }

    const newUser = new User(/**@type {string}*/(username), /**@type {string}*/(email), /**@type {string}*/(password));
    // addUser(newUser);
    //store.user.create(newUser, () => {
    //    console.log('Usuario creado exitosamente via store.');
    //});

    //TODO: utilizar el endpoint nuevo /register y manejar la respuesta, si hay error avisar de que el email o el username estan cogidos y sino derivar a profile.html
    const result = await getAPIData(
    'http://127.0.0.1:1337/create/users',
    'POST',
    JSON.stringify(newUser)
    );

    if (result) {
        alert('Registro exitoso, puedes iniciar sesion!');
        window.location.href = 'login.html';
    }
}

/**
 * Event handler for the login form submission.
 * It validates the input fields, checks if the user exists and the password is correct,
 * sets the current user and redirects to the profile page.
 * @param {Event} event - The submit event of the login form.
 */
async function onLogin(event) {
    event.preventDefault();

    let form = /**@type {HTMLFormElement}*/(event.target);
    let formData = new FormData(form);

    let email = formData.get('email')?.toString().trim();
    let password = formData.get('password')?.toString();

    if(!email || !password){
        return alert('Debes de completar todos los campos.');
    }

    const credentials = {email, password};

    const result = await getAPIData('http://127.0.0.1:1337/login', 'POST', JSON.stringify(credentials));

    if(!result || result.error){
        return alert('Credenciales incorrectas');
    }
    // let user = findUserByEmail(email);
    // let user = store.user.getByEmail(/** @type {string} */(email));

    // if(!user) return alert('No existe un usuario con ese email.');
    // if(!checkPassword(user, password)) return alert('La contraseña introducida es incorrecta.');

    setCurrentUser(result);
    alert('Has iniciado sesion exitosamente!');
    window.location.href = 'profile.html';

}