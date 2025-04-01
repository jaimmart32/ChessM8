import { setCurrentUser } from "./db.js";

//Google llama a handleGoogleLogin como función global, debe estar en window.
// podrian ahcer un login forzado, en el futuro se necesitara el backend para que
// mediante la API de google compruebe si el token es válido
function handleGoogleLogin(response) {
    let jwt = response.credential;
    console.log('JWT: ', jwt);
    // el payload del token viene en base64,hay que decodificarlo
    let payload = JSON.parse(atob(jwt.split('.')[1]));
    console.log('PAYLOAD: ', payload);
    let user = {
        username: payload.name,
        email: payload.email,
        avatarUrl: payload.picture,
        googleId: payload.sub,
        createdAt: new Date().toISOString()// No tiene sentido que cada vez que se logue
        //con google se guarde la fecha nueva, mirar como hacerlo mejor.
    };

    setCurrentUser(user);//no tiene los mismos atributos que el user normal, influye?

    alert(`Bienvenido ${user.username}`);
    window.location.href = 'profile.html';
}

window.handleGoogleLogin = handleGoogleLogin;