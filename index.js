
const chalk = require('chalk');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { Client } = require('pg');

const client = new Client({
    user: 'postgres',
    host: '172.24.0.1',
    database: 'postgres',
    password: 'postgres',
    port: 5432,
});

client.connect()
    .then(() => {
        console.log("Connected")
        app.listen(3001, () => console.log(chalk.green('Listening')));
    })
    .catch((err) => console.log("Erro ao connectar"));

const text = 'INSERT INTO users(name, email) VALUES($1, $2) RETURNING *';
const values = ['Lucas', 'lucascercun@gmail.com'];

client.query('DROP TABLE IF EXISTS users');
client.query('CREATE TABLE IF NOT EXISTS users (ID SERIAl PRIMARY KEY, name VARCHAR(30), email VARCHAR(30))');
client.query(text, values);

const getItems = () => {
    return new Promise(async (resolve, reject) => {
        let users = await client.query('SELECT * FROM users');
        if (users)
            resolve(users);
        else
            reject();
    });
}

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    getItems()
        .then((val) => res.send(val.rows))
        .catch(() => res.send("Erro"));
});
