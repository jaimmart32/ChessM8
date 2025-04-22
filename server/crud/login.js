import fs from 'fs';

export function login(file, credentials, callback){
    if(!fs.existsSync(file)){
        return callback('Base de datos no encontrada');
    }

    fs.readFile(file, (err, fileData) => {
        if(err){
            console.error('Error leyendo users.json:', err);
            return callback('Error leyendo de la base de datos');
        }

        const users = JSON.parse(fileData.toString());
        const user = users.find(u => u.email === credentials.email &&  u.password === credentials.password);

        if(!user){
            return callback('Credenciales incorrectas');
        }

        return callback(user);
    });
}
// Las contraseñas no deben almacenarse sin encriptar, en el futuro usar bcrypt o similar