const express = require('express');
const https = require('https');
const fs = require('fs');
const path = require('path');
const app = express();

//setting app
app.set('port', 3001);

//middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

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

const sslServer = https.createServer(
    {
        key: fs.readFileSync(path.join(__dirname,'cert','key.pem')),
        cert:fs.readFileSync(path.join(__dirname,'cert','cert.pem')),
    },
);

sslServer.listen(app.get('port'),()=>console.log(`Servidor iniciado! ${app.get('port')}`));