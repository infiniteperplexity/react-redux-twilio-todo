const port = process.env.PORT || 8080;
const path = require("path");
const express = require('express');
const app = express();
const fs = require('fs');
//const sqlite3 = require('sqlite3');
const sqlstring = require('sqlstring');
const bodyParser = require('body-parser');

app.use(bodyParser.json());

const pg = require('pg');

app.get('/db', function (request, response) {
  pg.connect(process.env.DATABASE_URL, function(err, client, done) {
    client.query('SELECT * FROM test_table', function(err, result) {
      done();
      if (err)
       { console.error(err); response.send("Error " + err); }
      else
       { response.render('pages/db', {results: result.rows} ); }
    });
  });
});


// Host
//     ec2-54-197-233-123.compute-1.amazonaws.com
// Database
//     d617v7kjmeq6k3
// User
//     eyujmilyjqvfgl
// Port
//     5432
// Password
//     e2b98beb94246886713833886d3585f8fb0805e9ff02124104db9e8e092f9439
// URI
//     postgres://eyujmilyjqvfgl:e2b98beb94246886713833886d3585f8fb0805e9ff02124104db9e8e092f9439@ec2-54-197-233-123.compute-1.amazonaws.com:5432/d617v7kjmeq6k3
// Heroku CLI
//     heroku pg:psql postgresql-rugged-91588 --app todo-by-glenn


// var dbinfo = {
//   host: 'us-cdbr-iron-east-04.cleardb.net',
//   user: 'bc8309dedbcac6',
//   password: '5271b38e',
//   database: 'heroku_d9a408c946dbc65'
// };

// assign and open database
//const db = new sqlite3.Database('./db/todo.db');

app.get('/', function(req, res) {
   res.sendFile(path.join(__dirname, '/test.html'));
});

app.get('/*.js*', function(req, res) {
   res.sendFile(path.join(__dirname, req.url));
});

app.listen(port, () => console.log('Example app listening on port'+port+'!'))
