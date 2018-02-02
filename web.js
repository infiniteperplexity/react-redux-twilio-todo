const port = process.env.PORT || 8080;
const path = require("path");
const express = require('express');
const app = express();
const fs = require('fs');
//const sqlite3 = require('sqlite3');
const sqlstring = require('sqlstring');
const bodyParser = require('body-parser');

app.use(bodyParser.json());

// assign and open database
//const db = new sqlite3.Database('./db/todo.db');

app.get('/', function(req, res) {
   res.sendFile(path.join(__dirname, '/test.html'));
});

app.get('/*.js*', function(req, res) {
   res.sendFile(path.join(__dirname, req.url));
});

app.listen(port, () => console.log('Example app listening on port'+port+'!'))
