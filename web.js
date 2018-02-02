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

app
  .set('views', path.join(__dirname, 'views'))
  .set('view engine', 'ejs')
  .get('/', (req, res) => res.render('pages/index'))
  .listen(port, () => console.log('Example app listening on port'+port+'!'));

  
app.get('/db', function (request, response) {
  pg.connect(process.env.DATABASE_URL, function(err, client, done) {
    client.query('SELECT * FROM quads', function(err, result) {
      done();
      if (err)
       { console.error(err); response.send("Error " + err); }
      else
       { response.render('pages/db', {results: result.rows} ); }
    });
  });
});

app.get('/', function(req, res) {
   res.sendFile(path.join(__dirname, '/test.html'));
});

app.get('/*.js*', function(req, res) {
   res.sendFile(path.join(__dirname, req.url));
});




app.get('/dbinit', function (request, response) {
  pg.connect(process.env.DATABASE_URL, function(err, client, done) {
    client.query(`CREATE TABLE IF NOT EXISTS quads (
      subject text NOT NULL,
      predicate text NOT NULL,
      object text NOT NULL,
      graph text NOT NULL,
      UNIQUE(subject, predicate, object, graph)
    )`, (err, result)=> {
      done();
      if (err) {
        console.error(err);
      } else {
        response.send("That totally worked!");
      }
    });
  });
});

app.get('/dbput', function (request, response) {
  pg.connect(process.env.DATABASE_URL, function(err, client, done) {
    client.query( `INSERT INTO quads (
      subject,
      predicate,
      object,
      graph)
      VALUES
      ('Hello','World','Foo','Bar'),
      ('Goodbye','World','Foo','Baz')
    ;`, (err, result)=> {
      done();
      if (err) {
        console.error(err);
      } else {
        console.log("sent a response");
        response.send("That totally worked!");
      }
    });
  });
});

