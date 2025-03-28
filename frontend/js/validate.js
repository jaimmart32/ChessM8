/* Este archivo se encarga de validar los campos del formulario de registro
  TODO: implementar versiones mas estrictas */

// Caracteres permitidos: letras, números, guion bajo
export function validateUsername(username) {
    return username.length >= 3 && /^[a-zA-Z0-9_]+$/.test(username);
}

// Tenga al menos un caracter antes del @ (que no sea espacio ni @).Tenga un @.
// Tenga al menos un caracter después del @ y antes del ., que tampoco sea espacio ni @.
// Tenga al menos un caracter después del punto.
export function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}
  
export function validatePassword(password) {
    return password.length >= 6;
}
  