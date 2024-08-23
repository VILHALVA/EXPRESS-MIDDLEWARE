require('dotenv').config();
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'login.html'));
});

app.post('/login', (req, res) => {
    const { nome, senha } = req.body;

    const adminName = process.env.ADMIN_NAME;
    const adminPassword = process.env.ADMIN_PASSWORD;

    if (nome === adminName && senha === adminPassword) {
        res.sendFile(path.join(__dirname, 'public', 'ADMIN.html'));
    } 
    else {
        res.sendFile(path.join(__dirname, 'public', 'USUARIO.html'));
    }
});

const PORT = process.env.PORT || 2000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
