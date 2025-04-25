// import { store } from './store/redux.js';
import { setCurrentUser, getCurrentUser } from './db.js';
import { validateUsername, validateEmail, validatePassword } from './validate.js';
import { requireAuth } from './authGuard.js';
import { getAPIData, HttpError } from './fetch.js';

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
    async function onSaveChanges(event){
        event.preventDefault();

        const username = profileForm.username.value.trim();
        const email = profileForm.email.value.trim();
        const newPassword = profileForm.password.value;
        //Como el name del campo tiene -, hace falta la notación de corchetes
        const confirmedPassword = profileForm['confirm-password'].value;

        if(!validateUsername(username)) return alert('Username inválido');
        if(!validateEmail(email)) return alert('Email inválido');
        if(newPassword && !validatePassword(newPassword)) return alert('Password inválida');
        if(newPassword && newPassword !== confirmedPassword) return alert('La confirmación de la password no coincide')

        // //Comprobar que el username esta disponible
        // const userWithSameUsername = store.user.getByUsername(username);
        // if( userWithSameUsername && userWithSameUsername.id !== currentUser.id){
        //     return alert('El username no está disponible');
        // }
        // //Comprobar si esta disponible el email
        // const userWithSameEmail = store.user.getByEmail(email);
        // if( userWithSameEmail && userWithSameEmail.id !== currentUser.id){
        //     return alert('El email no está disponible');
        // }
        //Actualizar datos del usuario
        const updatedUser = {
            ...currentUser,
            username: username || currentUser.username,
            email: email || currentUser.email,
            password: newPassword || currentUser.password,
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
        // store.user.update(updatedUser, () => {
        //     setCurrentUser(updatedUser);
        //     alert('Perfil actualizado correctamente');
        //     window.location.href = 'profile.html';
        // });
    }
}