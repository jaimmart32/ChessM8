import { clearCurrentUser } from "./db.js";

document.getElementById('logout').addEventListener('click', () => {
    clearCurrentUser();
    window.location.href = 'login.html';
})