import { getCurrentUser } from "./db.js";

window.addEventListener('DOMContentLoaded', () => {
    let user = getCurrentUser();

    if(!user) {
        window.location.href = 'login.html';
        return;
    }

    document.getElementById('username').textContent = user.username;
    document.querySelector('.avatar').src = user.avatarUrl;
    document.getElementById('member-since').textContent = `Miembro desde: ${new Date(user.createdAt).toLocaleDateString()}`;// Convierte la fecha a una cadena en formato local
});
