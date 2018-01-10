const port = 8080;
const express = require('express');
const app = express();
const sqlite3 = require('sqlite3');

app.get('/', (req, res) => res.send('Hello World!'))

app.listen(port, () => console.log('Example app listening on port'+port+'!'))
