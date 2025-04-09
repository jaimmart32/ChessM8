import { getCurrentUser } from "./db.js";
import { requireAuth } from "./authGuard.js";

requireAuth();

window.addEventListener('DOMContentLoaded', () => {
    let user = getCurrentUser();

    if(!user) {
        window.location.href = 'login.html';
        return;
    }
    const usernameEl = document.getElementById('username');
    if(usernameEl) usernameEl.textContent = user.username;
    
    /**@type {HTMLImageElement|null} */
    const avatarEl = document.querySelector('.avatar');
    if(avatarEl) avatarEl.src = user.avatarUrl;
    // document.querySelector('.avatar').src = user.avatarUrl;

    const memberEl = document.getElementById('member-since');
    if(memberEl) memberEl.textContent = `Miembro desde: ${new Date(user.createdAt).toLocaleDateString()}`;// Convierte la fecha a una cadena en formato local

    const editBtn = document.getElementById('edit-profile');
    editBtn?.addEventListener('click', () => {
        window.location.href = 'edit-profile.html';
    })
});
