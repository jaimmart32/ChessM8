/* Este archivo se encarga de validar los campos del formulario de registro */

export function validateUsername(username) {
    return username.length >= 3 && /^[a-zA-Z0-9_]+$/.test(username);
  }
  
  export function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }
  
  export function validatePassword(password) {
    return password.length >= 6;
  }
  