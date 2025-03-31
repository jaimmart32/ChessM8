import { isAuthenticated } from "./authGuard.js";
import { clearCurrentUser } from "./db.js";

// Muestra los links de la nav-bar segun si esta logueado o no
document.addEventListener('DOMContentLoaded', () => {
    let showIfLoggedIn = ['game-link', 'profile-link', 'logout-link'];
    let showIfLoggedOut = ['login-link', 'register-link'];
    
    let loggedIn = isAuthenticated();

    showIfLoggedIn.forEach(id => {
        let element = document.getElementById(id);
        if(element) element.style.display = loggedIn ? 'inline-block' : 'none';
    });

    showIfLoggedOut.forEach(id => {
        let element = document.getElementById(id);
        if(element) element.style.display = loggedIn ? 'none' : 'inline-block';
    });
});