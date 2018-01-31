const sqlite3 = require('sqlite3').verbose();
let user = "TEST";
const fs = require('fs');

let fname = "tasks_20170130.txt";
fs.readFile(__dirname+"/saved/"+fname, function read(err, data) {
    if (err) {
        throw err;
    }
    //console.log(JSON.parse(data));
    let db = new sqlite3.Database('./db/todo.db', (err) => {
    	if (err) {
	    	return console.error(err.message);
	  	}
	  	let resources = JSON.parse(data).map((triplet)=>{
	  		let {subject, predicate, object} = triplet;
	  		return [subject, predicate, object];
	  	});
	  	console.log(resources);
	  	db.serialize(() => {
	  		let inserts = [];
	  		for (let triplet of resources) {
	  			let [s, p, o] = triplet;
	  			inserts.push('("'+s+'"');
	  			inserts.push('"'+p+'"');
	  			inserts.push('"'+o+'"');
	  			inserts.push('"'+user+'")');
	  		}
	  		let insert = inserts.join(',');
	  		console.log(insert);
			db
			 .run(`CREATE TABLE IF NOT EXISTS quads (
			 	subject text NOT NULL,
			 	predicate text NOT NULL,
			 	object text NOT NULL,
			 	graph text NOT NULL
			 )`)
			 .run(`INSERT INTO quads (
			 	subject,
			 	predicate,
			 	object,
			 	graph)
			 	VALUES `
			 	+ insert + ';')
			 .close((e) => {
				if (err) {
				    return console.error(err.message);
				}
				console.log('Close the database connection.');
			});
	  		console.log('Connected to the on-disk SQlite database.');
		});
	});
});



