const port = process.env.PORT || 8080;
const path = require("path");
const express = require('express');
const pg = require('pg');
const sqlstring = require('sqlstring');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());


// function escape(s) {
//   if (typeof(s)==="boolean") {
//     return String("'"+s+"'");
//   }
//   let san = sqlstring.escape(s);
//   san = san.replace(/\\'/g,"''");
//   return san;
// }
// function unescape(s) {
//   let SPACER = "\u0000";
//   let SREGEX = new RegExp(SPACER,"g");
//   let unsan = s.replace(/\\n/g,SPACER);
//   unsan = unsan.replace(/\\/g,"");
//   unsan = unsan.replace(SREGEX,"\n");
//   unsan = unsan.replace(/''/g,"'");
//   return unsan;
// }

function escape(s) {return s};
function unescape(s) {return s};

app.get('/', function(req, res) {
   res.sendFile(path.join(__dirname, '/index.html'));
});

app.get('/*.js*', function(req, res) {
   res.sendFile(path.join(__dirname, req.url));
});

app.post('/db.*', function(req, res) {
  let user = req.url.split(".")[1];
  if (escape(user)!==("'"+user+"'")) {
    console.log("no special characters allowed in user name.");
    console.log(err);
    res.status(404).send();
    return;
  }
  let inserts = [];
  console.log("received rows");
  for (let triplet of req.body) {
    let [s, p, o] = triplet;
    inserts.push('('+escape(s));
    inserts.push(escape(p));
    inserts.push(escape(o));
    inserts.push('"'+user+'")');
  }
  let insert = inserts.join(',');
  let backup;
  let status = 200;
  // backup not currently active
  pg.connect(process.env.DATABASE_URL, function(err, client, done) {
    console.log("deleting rows");
    client.query("DELETE FROM quads WHERE graph = ?",user, (err) => {
      if (err) {
        done();
          console.error(err);
      } else {
        if (inserts.length>0) {
          console.log("inserting rows");
          client.query('INSERT INTO quads (subject,predicate,object,graph) VALUES '+insert, (err)=> {
            if (err) {
              done();
              console.error(err);
            } else {
              client.query("SELECT * FROM quads WHERE graph = ?",user,(err, result)=>{
                done();
                if (err) {
                  console.log("had an error retrieving updated rows.");
                  res.status(500).send();
                }
                for (let row of rows) {
                  row.subject = unescape(row.subject);
                  row.predicate = unescape(row.predicate);
                  row.object = unescape(row.object);
                  row.graph = unescape(row.graph);
                }
                console.log("sending rows");
                res.send(JSON.stringify(result.rows));
              });
            }
          });
        }
      }
    });
  });
});

app.get('/db.*', function(req, res) {
  let user = req.url.split(".")[1];
  pg.connect(process.env.DATABASE_URL, function(err, client, done) {
    console.log("selecting rows");
    client.query("SELECT * FROM quads WHERE graph = ?",user, (err, result) => {
      console.log("!!!!!!!!!!!0");
      done();
      console.log("!!!!!!!!!!!1");
      if (err) {
        console.log("had an error retrieving rows.");
        res.status(500).send();
      }
      console.log("!!!!!!!!!!!2");
      res.send(JSON.stringify(result.rows));
    });
  });
});


app.listen(port, () => console.log('Example app listening on port'+port+'!'))


/********************************************************/

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

