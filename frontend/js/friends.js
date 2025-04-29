import { getAPIData } from "./fetch.js";
import { requireAuth } from "./authGuard.js";
import { getCurrentUser } from "./db.js";

/**
 * @typedef {Object} User
 * @property {string} _id
 * @property {string} username
 * @property {string} email
 * @property {string} password
 * @property {string} avatarUrl
 * @property {string} createdAt
 * @property {{wins: number, losses: number, draws: number}} stats
 * @property {string[]} friends
 */

requireAuth();

// Coger los elementos de la página
const searchForm = document.getElementById('search-form');
const searchInput = document.getElementById('search-input');
const usersList = document.getElementById('users-list');
const prevPageBtn = document.getElementById('prev-page');
const nextPageBtn = document.getElementById('next-page');
const currentPageSpan = document.getElementById('current-page');

// Pagina y busqueda actual
let currentPage = 1;
let currentSearch = '';

//Listeners para los botones
searchForm?.addEventListener('submit', async (event) => {
    event.preventDefault();
    currentSearch = /** @type {HTMLInputElement} */(searchInput)?.value.trim();
    currentPage =  1;
    await fetchUsers();
});

prevPageBtn?.addEventListener('click', async () => {
    if(currentPage > 1){
        currentPage--;
        await fetchUsers();
    }
});

nextPageBtn?.addEventListener('click', async () => {
    currentPage++;
    await fetchUsers();
})

// Peticion mediante query ya que hay info que no se introduce en el formulario
async function fetchUsers(){
    const result = await getAPIData(`http://127.0.0.1:1337/api/users?username=${currentSearch}&page=${currentPage}&limit=5`);

    //Limpiar datos
    while(usersList?.firstChild){
        usersList.removeChild(usersList.firstChild);
    }

    //Mensaje informativo para cuando no hay resultados
    if(!result || result.length === 0){
        let message = document.createElement('p');
        message.textContent = 'No se encontraron usuarios.';
        usersList?.appendChild(message);
        return;
    }

    //Rellenar la lista con los resultados
    result.forEach((/** @type {User} */user) => {
       const userDiv = document.createElement('div');
       userDiv.classList.add('user-item');

       const usernameStrong = document.createElement('strong');
       usernameStrong.textContent = user.username;

       const createdAt = new Date(user.createdAt).toLocaleDateString('es-ES');

       const joinText = document.createElement('span');
       joinText.textContent = ` (Se unió el ${createdAt})`;

       const addButton = document.createElement('button');
       addButton.classList.add('btn');
       addButton.textContent = 'Agregar amigo';
       addButton.addEventListener('click', () => addFriend(user._id))
    
       //Montar el div y agregarlo a la lista
       userDiv.appendChild(usernameStrong);
       userDiv.appendChild(joinText);
       userDiv.appendChild(addButton);
       usersList?.appendChild(userDiv);
    });

    //Actualizar pagina
    if(currentPageSpan)
        currentPageSpan.textContent = `Página ${currentPage}`;
}


/**
 * Agrega un usuario con el id 'friendId' como amigo.
 * 
 * @param {string} friendId El id del usuario a agregar como amigo.
 */
async function addFriend(friendId){
    const currentUser = getCurrentUser();
    if(!currentUser){
        alert('No has iniciado sesion!');
        window.location.href = 'login.html'
        return;
    }
    try{
        const result = await getAPIData(
            'http://127.0.0.1:1337/api/add-friend',
            'POST',
            JSON.stringify({
                userId: currentUser._id,
                friendId: friendId

            })
        );

        if(result && result.success){
            alert('Amigo añadido exitosamente!');
        }
        else{
            alert('No se pudo agregar al amigo.');
        }
    }
    catch(err){
        console.error('Error al agregar amigo: ', err);
        alert('Ocurrió un error inesperado.');
    }
}

//consulta inicial
fetchUsers();