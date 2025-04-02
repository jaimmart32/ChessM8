/* Este archivo se encarga de validar los campos del formulario de registro
  TODO: implementar versiones mas estrictas */

/**
 * Valida que el username sea correcto.
 * Un username es valido si su longitud es mayor o igual a 3 y solo contiene
 * letras, números y el caracter de guion bajo.
 * @param {string|undefined} username Username a validar.
 * @returns {boolean} True si el username es valido, false en otro caso.
 */
export function validateUsername(username) {
    if(!username) return false;
    return username.length >= 3 && /^[a-zA-Z0-9_]+$/.test(username);
}

/**
 * Validates that the email is correctly formatted.
 * An email is valid if it contains at least one character before the '@',
 * followed by the '@' character, at least one character between the '@' and '.',
 * and at least one character after the '.'.
 * @param {string|undefined} email - The email address to validate.
 * @returns {boolean} True if the email is valid, false otherwise.
 */
export function validateEmail(email) {
    if(!email) return false;
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}
  
/**
 * Validates that the password is correctly formatted.
 * A password is valid if it has at least 6 characters.
 * @param {string|undefined} password - The password to validate.
 * @returns {boolean} True if the password is valid, false otherwise.
 */
export function validatePassword(password) {
    if(!password) return false;
    return password.length >= 6;
}
  