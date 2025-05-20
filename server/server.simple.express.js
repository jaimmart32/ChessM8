import express from 'express';
import bodyParser from 'body-parser';
import { crud } from './server.crud.js'
import { db } from './server.mongodb.js';
import { handleSignIn, handleLogin, handleUpdateProfile, handleGetUsers, handleAddFriend, handleGetFriends, handleRemoveFriend } from './controllers/users.js';
import { handleCreateGame, handleGetGame, handleUpdateGame, handleDeleteGame, handleGetAvailableGames, } from './controllers/games.js';
import { handleMove, handleGetGameState, handleSurrender } from './controllers/gameLogic.js';

const app = express();
const port = process.env.PORT;
const USERS_URL = './server/BBDD/users.json';

// Static server
app.use(express.static('frontend'));
// for parsing application/json
app.use(bodyParser.json());
// for parsing application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// API ENDPOINTS

// este endpoint no deberia de existir ya que expondria toda la base de datos al front
app.get('/read/users', (req, res) => {
    crud.read(USERS_URL, (data) => {
        console.log('server read users', data);

        res.send(JSON.stringify(data));
    });
});

app.post('/create/users', (req, res) => {
    crud.create(USERS_URL, req.body, (data) => {
        console.log(`server create user ${data.username} creado`, data);

        res.send(JSON.stringify(data));
    });
});

app.post('/register', (req, res) => {
    crud.read(USERS_URL, (users) => {
        const { email, username } = req.body;
        const exists = users.some(user => user.email === email || user.username === username);

        if(exists){
            return res.status(409).send({error: 'Email o username ya registrados.'});
        }

        crud.create(USERS_URL, req.body, (newUser) => {
            console.log(`server create user ${newUser.username} creado`, newUser);
            res.status(201).send(newUser);
        })
    })
})

app.post('/login', (req, res) => {
    crud.login(USERS_URL, req.body, (result) => {
        if(typeof result === 'string'){
            return res.status(401).send({error: result});
        }
        res.send(result);
    });
});

app.put('/update-profile', (req, res) => {
    const updatedData = req.body;
    const { id, email, username } = updatedData;
    if(!id){
        return res.status(400).send({error: 'ID no proporcionado'});
    }

    crud.read(USERS_URL, (users) => {
        const conflict = users.find(user =>
        (user.email === email || user.username === username) &&
        user.id != id
        );
        if(conflict){
            return res.status(409).send({error: 'Username o email ya en uso por otro usuario.'});
        }

        crud.update(USERS_URL, id, updatedData, (updatedUser) => {
            res.status(200).send(updatedUser);
        });
    });
});

// API ENDPOINTS CON MONGODB

// Users
app.get('/api/count/users', async (req, res) => {
    const users = await db.users.count();
    res.send(`En este momento hay ${users} usuarios registrados en la base de datos.`);
})
app.post('/api/register', handleSignIn);
app.post('/api/login', handleLogin);
app.put('/api/update-profile', handleUpdateProfile);
app.get('/api/users', handleGetUsers);

app.post('/api/add-friend', handleAddFriend);
app.post('/api/friends', handleGetFriends);
app.post('/api/remove-friend', handleRemoveFriend);

// Games

app.post('/api/games', handleCreateGame);
app.get('/api/games/:id', handleGetGame);
app.put('/api/games/:id', handleUpdateGame);
app.delete('/api/games/:id', handleDeleteGame);
app.get('/api/games/available', handleGetAvailableGames);

// API para partidas online
app.post('/api/games/:id/move', handleMove);
app.get('/api/games/:id/state', handleGetGameState);
app.post('/api/games/:id/surrender', handleSurrender);


app.listen(port, () => {
    console.log(`example app listening on port ${port}`);
});