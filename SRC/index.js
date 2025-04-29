const express = require('express');
const path = require('path');
const { createTransaction, commitTransaction } = require('./transbank.js');
const app = express();

app.set('port', 3001);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, '../formulario')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../formulario/index.html'));
});

app.post('/user', async (req, res) => {
    try {
        const { nombre, telefono, edad, email, caso, monto } = req.body;
        
        if (!monto) {
            throw new Error('El monto es requerido');
        }

        const ordenCompra = generateOrderId();
        const returnUrl = `${req.protocol}://${req.get('host')}/confirmar-transaccion`.trim();
        
        console.log('Iniciando transacción con:', {
            monto,
            ordenCompra,
            returnUrl
        });

        const transaction = await createTransaction(
            parseInt(monto),
            ordenCompra,
            returnUrl
        );

        console.log('Transacción creada:', transaction);

        res.json({
            status: "success",
            url: transaction.url.trim(),
            token: transaction.token
        });
    } catch (error) {
        console.error('Error detallado:', error);
        res.status(500).json({
            status: "error",
            message: "Error al procesar la transacción: " + error.message
        });
    }
});

app.get('/confirmar-transaccion', async (req, res) => {
    try {
        const { token_ws } = req.query;
        
        if (!token_ws) {
            return res.redirect('/fracaso');
        }

        const commitResponse = await commitTransaction(token_ws);
        
        if (commitResponse.status === 'AUTHORIZED') {
            res.redirect('/exito');
        } else {
            res.redirect('/fracaso');
        }
    } catch (error) {
        console.error('Error al confirmar transacción:', error);
        res.redirect('/fracaso');
    }
});

app.get('/exito', (req, res) => {
    res.sendFile(path.join(__dirname, '../formulario/exito.html'));
});

app.get('/fracaso', (req, res) => {
    res.sendFile(path.join(__dirname, '../formulario/fracaso.html'));
});

app.listen(app.get('port'), () => {
    console.log(`Server running on port ${app.get('port')}`);
});

function generateOrderId() {
    const timestamp = Date.now().toString().slice(-8);
    const random = Math.random().toString(36).substring(2, 6);
    return `OC${timestamp}${random}`;
}