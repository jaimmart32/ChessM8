import { store } from './store/redux.js';
import { setCurrentUser, getCurrentUser } from './db.js';
import { validateUsername, validateEmail, validatePassword } from './validate.js';
import { requireAuth } from './authGuard.js';

requireAuth();

//TODO: COMPROBAR QUE FUNCIONA BIEN EDITAR EL PERFIL.
const form = document.getElementById('edit-profile-form');
if(form){
    form.addEventListener('submit', onSaveChanges);

    const profileForm = /** @type {HTMLFormElement} */(form);
    const currentUser = getCurrentUser();

    //Rellenar el formulario con los datos del usuario
        profileForm.username.value = currentUser.username;
        profileForm.email.value = currentUser.email;

    /**
     * Event handler for the edit profile form submission.
     * It validates the input fields, updates the current user and redirects to the profile page.
     * @param {Event} event - The submit event of the edit profile form.
     */
    function onSaveChanges(event){
        event.preventDefault();

        const username = profileForm.username.value.trim();
        const email = profileForm.email.value.trim();
        const newPassword = profileForm.password.value;

        if(!validateUsername(username)) return alert('Username inválido');
        if(!validateEmail(email)) return alert('Email inválido');
        if(newPassword && !validatePassword(newPassword)) return alert('Password inválida');

        //Actualizar datos del usuario
        const updatedUser = {
            ...currentUser,
            username: username || currentUser.username,
            email: email || currentUser.email,
            password: newPassword || currentUser.password,
        };

        store.user.update(updatedUser, () => {
            setCurrentUser(updatedUser);
            alert('Perfil actualizado correctamente');
            window.location.href = 'profile.html';
        });
    }
}