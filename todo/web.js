const port = process.env.PORT || 8080;
const path = require("path");
const express = require('express');
const app = express();
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');
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
	let inserts = [];
	console.log("received rows");
	console.log(req.body);
	for (let triplet of req.body) {
  		let [s, p, o] = triplet;
  		inserts.push('("'+s+'"');
  		inserts.push('"'+p+'"');
  		inserts.push('"'+o+'"');
  		inserts.push('"'+user+'")');
  	}
  	let insert = inserts.join(',');
	db.serialize(()=> {
		db.run("DELETE FROM quads WHERE graph = ?",user,(err)=>{
			if (err) {
				console.log("had an error deleting rows.");
				console.log(err);
				res.status(404).send();
			}
		});
		if (inserts.length>0) {
			db.run('INSERT INTO quads (subject,predicate,object,graph) VALUES '+insert,(err)=>{
				if (err) {
					console.log("had an error inserting rows.");
					console.log(err);
					res.status(404).send();
				}
			});
		}
		db.all("SELECT * FROM quads WHERE graph = ?",user,(err, rows)=>{
		// // .all('SELECT * FROM quads WHERE graph IN ("resources",?)',user,(err, rows)=>{
			if (err) {
				console.log("had an error retrieving updated rows.");
				res.status(404).send();
			}
			console.log("sending updated rows...");
			console.log(JSON.stringify(rows));
			res.send(JSON.stringify(rows));
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
		console.log("sending rows...");;
		console.log(JSON.stringify(rows));
		res.send(JSON.stringify(rows));
	});
});


app.listen(port, () => console.log('Example app listening on port'+port+'!'))
