const express = require('express');
const app = express();

//setting app
app.set('port', 3001);

//middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//routes
app.get('/user', (req, res) => {
    res.send({
    "id": "0001",
    "name": "name",
    "fono": "fono",
    "edad": "edad",
    "email": "email"
    });
});

app.get('/hola', (req, res) => {
    res.send("Hola a todos!");
});

//levantando el servicio HTTP
app.listen(app.get('port'), () => {
    console.log(`Servidor iniciado! ${app.get('port')}`);
});