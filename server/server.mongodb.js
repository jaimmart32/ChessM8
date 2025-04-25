import { MongoClient, ObjectId } from 'mongodb';

const URI = process.env.MONGO_URI;

export const db = {
    users: {
        get: getUsers,
        count: countUsers,
        create: createUser,
        update: updateUser,
        delete: deleteUser
        // signIn: signInUser
    },
    games: {

    }

}

/**
 * @summary Devuelve el numero de usuarios en la base de datos de la app.
 * @return {Promise<number>}
 */
async function countUsers(){
    const mdbClient = new MongoClient(URI);
    const chessDB = mdbClient.db('ChessM8');
    const usersCollection = chessDB.collection('users');
    return await usersCollection.countDocuments();
}

/**
 * @summary Recupera una lista de usuarios que coinciden con el filtro.
 * @param {Object} [filter] - El filtro para aplicar a la busqueda.
 * @property {string} [filter.id] - El id del usuario a buscar.
 * @property {string} [filter.username] - El nombre de usuario a buscar.
 * @property {string} [filter.email] - El correo electronico a buscar.
 * @property {boolean} [filter.online] - El estado de la sesion a buscar.
 * @returns {Promise<Array<User>>} Promesa que devuelve una lista de usuarios.
 */
async function getUsers(filter){
    const mdbClient = new MongoClient(URI);
    const chessDB = mdbClient.db('ChessM8');
    const usersCollection = chessDB.collection('users');
    return await usersCollection.find(filter).toArray();
}

async function createUser(user){
   const mdbClient = new MongoClient(URI);
   const chessDB = mdbClient.db('ChessM8');
   const usersCollection = chessDB.collection('users');
   const result = await usersCollection.insertOne(user);
   return {...user, _id: result.insertedId};
}

/**
 * @summary Actualiza un usuario existente en la base de datos.
 * @param {string} id - El id del usuario a actualizar.
 * @param {Object} updatedFields - Un objeto con los campos del usuario a
 * actualizar.
 * @property {string} [updatedFields.username] - El nuevo nombre de usuario.
 * @property {string} [updatedFields.email] - El nuevo correo electronico.
 * @property {string} [updatedFields.password] - La nueva contrasena.
 * @property {string} [updatedFields.avatarUrl] - La ruta de la nueva imagen
 * de perfil.
 * @returns {Promise<boolean>} Promesa que devuelve true si el usuario ha sido
 * actualizado correctamente, false en caso contrario.**/
async function updateUser(id, updatedFields){
   const mdbClient = new MongoClient(URI);
   const chessDB = mdbClient.db('ChessM8');
   const usersCollection = chessDB.collection('users');

   // En el front se necesita el _id en current_user de localstorage. Para que
   // al hacer el updateOne no trate de editar el campo _id que es inmutable,
   // hay que extraerlo de los campos a actualizar.
   const { _id, ...fieldsToUpdate } = updatedFields;
   console.log(`ID del usuario que solicita el update: ${_id}`);

   const result = await usersCollection.updateOne(
    { _id: new ObjectId(id) },
    { $set: fieldsToUpdate}
   );

   return result.modifiedCount > 0;
}

/**
 * @summary Elimina un usuario de la base de datos.
 * @param {string} id - El id del usuario a eliminar.
 * @returns {Promise<boolean>} Promesa que devuelve true si el usuario ha sido
 * eliminado correctamente, false en caso contrario.
 */
async function deleteUser(id){
   const mdbClient = new MongoClient(URI);
   const chessDB = mdbClient.db('ChessM8');
   const usersCollection = chessDB.collection('users');
   const result = await usersCollection.deleteOne({ _id: new ObjectId(id) });
   return result.deletedCount > 0;
}