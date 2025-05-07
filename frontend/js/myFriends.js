import { getCurrentUser, setCurrentUser } from "./db.js";
import { getAPIData } from "./fetch.js";
import { requireAuth } from "./authGuard.js";

requireAuth();

const friendsList = document.getElementById('friends-list');

const currentUser = getCurrentUser();
if(!currentUser){
    alert('Debes de iniciar sesion primero');
    window.location.href = 'login.html';
}

async function fetchFriends() {
    try{
        const result = await getAPIData('http://127.0.0.1:1337/api/friends',
            'POST',
            JSON.stringify({ friendIds: currentUser.friends })
        );

        if(result && result.length > 0){
            renderFriends(result);
        }
        else {
            const msg = document.createElement('p');
            msg.textContent = 'No tienes amigos añadidos';
            friendsList?.appendChild(msg);
        }
    }
    catch(err)  {
        console.error('Error al obtener la lista de amigos: ', err);
        const errMsg = document.createElement('p');
        errMsg.textContent = 'Error al cargar amigos, intentalo mas tarde';
        friendsList?.appendChild(errMsg);
    }
}

function renderFriends(friends) {
    //Limpiar contenido
    while(friendsList?.firstChild) {
        friendsList.removeChild(friendsList.firstChild);
    }

    friends.forEach( friend => {
        const friendDiv = document.createElement('div');
        friendDiv.classList.add('friend-item');

        //Crear imagen del avatar
        const avatarImg = document.createElement('img');
        avatarImg.src = friend.avatarUrl;
        avatarImg.alt = `${friend.username} avatar`;
        avatarImg.classList.add('avatar');

        const usernameStrong = document.createElement('strong');
        usernameStrong.textContent = friend.username;

        const createdAt = new Date(friend.createdAt).toLocaleDateString('es-ES');
        const joinText = document.createElement('span');
        joinText.textContent = ` (Se unió el ${createdAt})`;

        //Crear boton para eliminar amigo
        const removeButton = document.createElement('button');
        removeButton.classList.add('btn', 'btn-remove');
        removeButton.textContent = 'Eliminar amigo';
        removeButton.addEventListener('click', async () => {
            await removeFriend(friend._id);
            fetchFriends();//Recargar lista tras eliminar
        })
        //Montar el div del amigo y agregarlo a la lista
        friendDiv.appendChild(avatarImg);
        friendDiv.appendChild(usernameStrong);
        friendDiv.appendChild(joinText);
        friendDiv.appendChild(removeButton);

        friendsList?.appendChild(friendDiv);
    });
}

async function removeFriend(friendId) {
    try{
        const result = await getAPIData('http://127.0.0.1:1337/api/remove-friend',
            'POST',
            JSON.stringify({ userId: currentUser._id, friendId })
        );

        if(result && result.success){
            //Actualizar localStorage
            const updatedFriends = currentUser.friends.filter(id => id !== friendId);
            currentUser.friends = updatedFriends;
            setCurrentUser(currentUser);
            alert('Amigo eliminado exitosamente');
        }
        else{
            alert('Error al eliminar el amigo');
        }
    }
    catch(err) {
        console.error('Error al eliminar amigo: ', err);
        alert('Error al intentar eliminar un amigo de la lista.')
    }
    
}
fetchFriends();