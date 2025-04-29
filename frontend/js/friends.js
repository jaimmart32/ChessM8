import { getAPIData } from "./fetch.js";
import { requireAuth } from "./authGuard.js";

/**
 * @typedef {Object} User
 * @property {string} id
 * @property {string} username
 * @property {string} email
 * @property {string} password
 * @property {string} avatarUrl
 * @property {string} createdAt
 * @property {{wins: number, losses: number, draws: number}} stats
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
       const userP = document.createElement('p');
       const usernameStrong = document.createElement('strong');
       usernameStrong.textContent = user.username;
       userP.appendChild(usernameStrong);
       const createdAt = new Date(user.createdAt).toLocaleDateString('es-ES');
       userP.append(` (Se unió el ${createdAt})`);
       usersList?.appendChild(userP);
    });

    //Actualizar pagina
    if(currentPageSpan)
        currentPageSpan.textContent = `Página ${currentPage}`;
}

//consulta inicial
fetchUsers();