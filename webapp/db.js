const sqlite3 = require('sqlite3').verbose();
const uuid = require('uuid');

let resources = [
	[':Task','rdfs:subClassOf','rdfs:Class'],
	[':isDueOn','rdfs:domain',':Task'],
	[':isDueOn','rdfs:range','xsd:date'],
	[':created','rdfs:domain',':Task'],
	[':created','rdfs:range','xsd:date'],
	[':isComplete','rdfs:domain',':Task'],
	[':isComplete','rdfs:range','xsd:boolean'],
	[':SubTasks','rdfs:subClassOf','rdf:Seq'],
	[':hasSubTasks','rdfs:domain',':Task'],
	[':hasSubTasks','rdfs:range',':SubTasks'],
	[':TaskTag','rdfs:subClassOf','rdfs:Class'],
	[':taggedAs','rdfs:domain',':Task'],
	[':taggedAs','rdfs:range',':TaskTag']
];
let db = new sqlite3.Database('./db/todo.db', (err) => {
  	if (err) {
    	return console.error(err.message);
  	}
  	db.serialize(() => {
  		let inserts = [];
  		for (let triplet of resources) {
  			let [s, p, o] = triplet;
  			inserts.push('("'+s+'"');
  			inserts.push('"'+p+'"');
  			inserts.push('"'+o+'"');
  			inserts.push('"resources")');
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