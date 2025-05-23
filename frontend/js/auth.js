// import { User } from './classes/User.js';
import { setCurrentUser } from './db.js';
// import { validateUsername, validateEmail, validatePassword } from './validate.js';
// import { store } from './store/redux.js';

//// @ts-expect-error Hazte caso
// window.addEventListener('stateChanged', (/** @type {CustomEvent}*/event) => {
//     console.log('Cambio de estado en redux: ', event.detail);
// })

const signInFormComponent = document.querySelector('signin-form-lit');
signInFormComponent?.addEventListener('signin-form-submitted', (event) => {
    const { success, user, error } = event.detail;

    if(success) {
        console.log(user);
        window.location.href = 'login.html';
    }
    else {
        alert(error)
    }
})


const loginFormComponent = document.querySelector('login-form-lit');
loginFormComponent?.addEventListener('login-form-submitted', (event) => {
    const { success, user, error } = event.detail;

    if(success) {
        setCurrentUser(user);
        window.location.href = 'profile.html';
    }
    else {
        alert(error);
    }
})