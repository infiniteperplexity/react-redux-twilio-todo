const port = process.env.PORT || 8080;
const path = require("path");
const express = require('express');
const app = express();
const fs = require('fs');
const sqlite3 = require('sqlite3');
const sqlstring = require('sqlstring');
const bodyParser = require('body-parser');

// this escape library isn't that great for SQLite...
function escape(s) {
	if (typeof(s)==="boolean") {
		return String("'"+s+"'");
	}
	let san = sqlstring.escape(s);
	san = san.replace(/\\'/g,"''");
	// possibly other fixes, if I find more
	return san;
}
function unescape(s) {
	let SPACER = "\u0000";
	let SREGEX = new RegExp(SPACER,"g");
	let unsan = s.replace(/\\n/g,SPACER);
	unsan = unsan.replace(/\\/g,"");
	unsan = unsan.replace(SREGEX,"\n");
	unsan = unsan.replace(/''/g,"'");
	return unsan;
}
app.use(bodyParser.json());
// assign and open database
const db = new sqlite3.Database('./db/todo.db');

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
    // back up the rows in case something fails
  db.all("SELECT * FROM quads WHERE graph = ?",user,(err, rows)=>{
    if (err) {
      console.log("had error backing up rows.");
      console.log(err);
      res.status(500).send();
      return;
    }
    backup = rows;
    db.serialize(()=> {
      db.run("DELETE FROM quads WHERE graph = ?",user,(err)=>{
        if (err) {
          console.log("had an error deleting rows.");
          console.log(err);
          res.status(500).send();
          return;
        }
      });
      if (inserts.length>0) {
        console.log("inserting rows");
        db.run('INSERT INTO quads (subject,predicate,object,graph) VALUES '+insert,(err)=>{
          if (err) {
            console.log("had an error inserting rows.");
            console.log(err);
            // res.status(500).send();
            // recover from backup
            inserts = [];
            for (let {subject, predicate, object, graph} of backup) {
              inserts.push('('+escape(subject));
                inserts.push(escape(predicate));
                inserts.push(escape(object));
                inserts.push(escape(graph)+')');
            }
              let insert = inserts.join(',');
              console.log("repairing rows from backup.");
            db.run('INSERT INTO quads (subject,predicate,object,graph) VALUES '+insert,(err)=>{
              if (err) {
                console.log("had an error repairing rows.");
                console.log(err);
                fs.writeFile(__dirname+"/serialize/"+user+"_backup.txt",JSON.stringify(rows,null,2), (err)=> {
                  if (err) {
                    return console.log(err);
                  }
                  res.status(500).send();
                });
                return;
              }
              console.log("repaired rows");
            });
          }
        });
      }
      db.all("SELECT * FROM quads WHERE graph = ?",user,(err, rows)=>{
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
        res.send(JSON.stringify(rows));
        fs.writeFile(__dirname+"/serialize/"+user+".txt",JSON.stringify(rows,null,2), (err)=> {
          if (err) {
            return console.log(err);
          }
        });
      });
    });
  });
});

app.get('/db.*', function(req, res) {
  let user = req.url.split(".")[1];
  // ignore resources for now
  db.all("SELECT * FROM quads WHERE graph = ?",user,(err, rows)=>{
  // return all rows that are either for this user, or are for all users
  //db.all("SELECT * FROM quads WHERE graph IN (?, 'resources')",user,(err, rows)=>{
    if (err) {
      console.log("had an error retrieving rows.");
      res.status(404).send();
    }
    res.send(JSON.stringify(rows));
  });
});

app.listen(port, () => console.log('Example app listening on port'+port+'!'))
