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


app.get('/dbinit', function (request, response) {
  pg.connect(process.env.DATABASE_URL, function(err, client, done) {
      // client.query('SELECT * FROM test_table', function(err, result) {
     //     done();
     //     if (err) {
     //       console.error(err);
     //       response.send("Error " + err);
     //     } else {
     //       response.render('pages/db', {results: result.rows});
     //     }
      // });

      client.query(`CREATE TABLE IF NOT EXISTS quads (
      subject text NOT NULL,
      predicate text NOT NULL,
      object text NOT NULL,
      graph text NOT NULL,
      UNIQUE(subject, predicate, object, graph)
     )`, (err, result)=> {
      if (err) {
        console.error(err);
      } else {
        response.render('pages/dbinit', {results: "Created table."});
      }
     };
    });
});