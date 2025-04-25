import { db } from '../server.mongodb.js';

/*Gracias a los middlewares que ya estan configurados en el server.express.js:
app.use(bodyParser.json()); todas las peticiones con Content-Type: application/json 
que lleguen al servidor tengan su req.body automáticamente convertido a un objeto 
JavaScript.*/

export async function handleSignIn(req, res){
    const { username, email, password } = req.body;
    if(!username || !email || !password){
        return res.status(400).send({ error: 'Faltan campos obligatorios'});
    }

    const existingUsers = await db.users.get({
        $or: [{ email }, { username }]
    });

    if(existingUsers.length > 0){
        return res.status(409).send({error: 'Email o username ya registrados'});
    }

    const newUser =  await db.users.create(req.body);
    console.log(`Usuario ${newUser.username} creado correctamente`);
    return res.status(201).send(newUser);
}

export async function handleLogin(req, res){
    const { email, password } = req.body;
    if(!email || !password){
        return res.status(400).send({error: 'Faltan campos obligatorios'});
    }

    const users = await db.users.get({ email, password });
    if(users.length === 0){
        return res.status(401).send({error: 'Credenciales incorrectas' });
    }

    return res.status(200).send(users[0]);
}

export async function handleUpdateProfile(req, res){
    const updatedData = req.body;
    const { _id, email, username } = updatedData;

    if(!_id){
        return res.status(400).send({error: 'ID no proporcionado'});
    }

    const conflicts = await db.users.get({
        $or: [{ email }, { username }]
    });

    // Si en los resultados hay un user con un id distinto al propio hay conflicto
    const conflict = conflicts.find(user => user._id.toString() !== _id);

    if(conflict){
        return res.status(409).send({error: 'Username o email ya en uso por otro usuario'});
    }

    const success = await db.users.update(_id, updatedData);
    if(!success){
        return res.status(500).send({error: 'No se pudo actualizar el usuario'});
    }
    return res.status(200).send(updatedData);
}