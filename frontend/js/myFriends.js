import { getCurrentUser } from "./db.js";
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

        //Montar el div del amigo y agregarlo a la lista
        friendDiv.appendChild(avatarImg);
        friendDiv.appendChild(usernameStrong);
        friendDiv.appendChild(joinText);

        friendsList?.appendChild(friendDiv);
    });
}

fetchFriends();