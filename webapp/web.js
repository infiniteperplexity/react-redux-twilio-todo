const port = process.env.PORT || 8080;
const path = require("path");
const express = require('express');
const app = express();
const sqlite3 = require('sqlite3');

app.get('/', function (req, res) {
   res.sendFile(path.join(__dirname, '/index.html'));
});

app.get('/*.js', function (req, res) {
   res.sendFile(path.join(__dirname, req.url));
});

app.get('/*.jsx', function (req, res) {
   res.sendFile(path.join(__dirname, req.url));
});


app.listen(port, () => console.log('Example app listening on port'+port+'!'))
