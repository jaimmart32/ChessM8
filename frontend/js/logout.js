import { clearCurrentUser } from "./db.js";

document.getElementById('logout-link')?.addEventListener('click', () => {
    clearCurrentUser();
    window.location.href = 'login.html';
})