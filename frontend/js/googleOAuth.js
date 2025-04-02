import { addUser, findUserByEmail, setCurrentUser } from "./db.js";

//Google llama a handleGoogleLogin como función global, debe estar en window.
// podrian ahcer un login forzado, en el futuro se necesitara el backend para que
// mediante la API de google compruebe si el token es válido

/**
 * @param {Object} response - La respuesta de la autenticación de Google
 * @param {string} response.credential - El token de autenticación
 */
function handleGoogleLogin(response) {
    let jwt = response.credential;
    console.log('JWT: ', jwt);
    // el payload del token viene en base64,hay que decodificarlo
    let payload = JSON.parse(atob(jwt.split('.')[1]));
    console.log('PAYLOAD: ', payload);
    
    let existingUser = findUserByEmail(payload.email);
    let user;

    if(existingUser) {
        console.log('El usuario ya existe en la base de datos.');
        user = existingUser;
    }
    else {
        console.log('Usuario nuevo, registrandolo en la base de datos');
        user = {
            id: payload.sub,
            username: payload.name,
            email: payload.email,
            avatarUrl: payload.picture,
            password: 'GooglePass',
            createdAt: new Date().toISOString(),
            stats: {
                wins: 0,
                losses: 0,
                draws: 0
            }
        };
        addUser(user);
    }
    setCurrentUser(user);

    alert(`Bienvenido ${user.username}`);
    window.location.href = 'profile.html';
}

// @ts-expect-error 
window.handleGoogleLogin = handleGoogleLogin;