import { getCurrentUser } from "./db.js";

// Para evitar la "navegación forzada" o "URL tampering".
export function requireAuth() {
    let user = getCurrentUser();
    if(!user) {
        alert('Debes de iniciar sesion para acceder aqui.');
        window.location.href = 'login.html';
    }
}

 // true si hay usuario, false si no. La doble negacion(!!) es muy usado 
 // en la comunidad JavaScript para coerción explícita a booleano.
export function isAuthenticated() {
    return !!getCurrentUser();
  }