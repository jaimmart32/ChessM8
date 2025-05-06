// import { store } from './store/redux.js';
import { setCurrentUser, getCurrentUser } from './db.js';
import { validateUsername, validateEmail, validatePassword } from './validate.js';
import { requireAuth } from './authGuard.js';
import { getAPIData, HttpError } from './fetch.js';

requireAuth();

const formComponent = document.querySelector('edit-profile-form-lit');
const currentUser = getCurrentUser();

if(formComponent){
    formComponent.username = currentUser.username;
    formComponent.email = currentUser.email;
}

formComponent?.addEventListener('edit-profile-submitted', async (event) => {
    const { username, email, password, confirmPassword } = event.detail;

    if (!validateUsername(username)) return alert('Username inválido');
    if (!validateEmail(email)) return alert('Email inválido');
    if (password && !validatePassword(password)) return alert('Password inválida');
    if (password && password !== confirmPassword) return alert('Las contraseñas no coinciden');

    const updatedUser = {
        ...currentUser,
        username: username || currentUser.username,
        email: email || currentUser.email,
        password: password || currentUser.password
    };

    try{
        const result = await getAPIData('http://127.0.0.1:1337/api/update-profile', 'PUT', JSON.stringify(updatedUser));

        setCurrentUser(result);
        alert('Perfil actualizado correctamente');
        window.location.href = 'profile.html';
    }
    catch(err){
        if(err instanceof HttpError && err.response.status === 409){
            alert('El username o email ya estan en uso');
        }
        else{
            alert('Error al actualizar el perfil, intentalo mas tarde');
            console.error(err);
        }
    }
});