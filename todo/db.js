const sqlite3 = require('sqlite3').verbose();
const uuid = require('uuid');
const sqlstring = require('sqlstring');

let resources = [
	[':Task','rdfs:subClassOf','rdfs:Class'],
	[':List','rdfs:subClassOf',':Task'],
	[':Filter','rdfs:subClasSOf','rdfs:Class'],
	[':due','rdfs:domain',':Task'],
	[':due','rdfs:range','xsd:date'],
	[':created','rdfs:domain',':Task'],
	[':created','rdfs:range','xsd:dateTime'],
	[':status','rdfs:domain',':Task'],
	[':status','rdfs:range',':Status'],
	[':updated','rdfs:domain',':Status'],
	// wanted this to be "time or datetime" but there is no common superclass
	[':updated','rdfs:domain',':rdfs:Literal'],
	[':SubTasks','rdfs:subClassOf','rdf:Seq'],
	[':hasSubTasks','rdfs:domain',':Task'],
	[':hasSubTasks','rdfs:range',':SubTasks'],
	[':Tag','rdfs:subClassOf','rdfs:Class'],
	[':tagged','rdfs:domain',':Task'],
	[':tagged','rdfs:range',':Tag'],
	[':repeats','rdfs:domain',':Task'],
	[':repeats','rdfs:range','rdfs:Literal']
];

let statics = [
	// The list of all tasks; only need if Lists are tasks
	['$Root','a',':List'],
	// The dynamic list of all lists
	['$List','a',':List'],
	// The dynamic list of all untagged tasks
	['$Inbox','a',':List'],
	// The dynamic list of all repeating tasks
	['$Repeating','a',':List']
	// The dynamic list of all completed, non-repeating tasks
	['$Completed','a',':List'],
	// The dynamic list of all incomplete, non-repeating tasks
	['$Incomplete','a',':List'],
	// A list of all tags...wait, but if tags aren't tasks, then it wouldn't work like that
	['$Tags','a',':List'],
	// A tag you can attach to one and only one list
	['$Home','a',':Tag'],
];
let db = new sqlite3.Database('./db/todo.db', (err) => {
  	if (err) {
    	return console.error(err.message);
  	}
  	db.serialize(() => {
  		let inserts = [];
  		for (let triplet of resources) {
  			let [s, p, o] = triplet;
  			inserts.push('("'+sqlstring.escape(s)+'"');
  			inserts.push('"'+sqlstring.escape(p)+'"');
  			inserts.push('"'+sqlstring.escape(o)+'"');
  			inserts.push('"resources")');
  		}
  		let insert = inserts.join(',');
  		console.log(insert);
		db
		 .run(`CREATE TABLE IF NOT EXISTS quads (
		 	subject text NOT NULL,
		 	predicate text NOT NULL,
		 	object text NOT NULL,
		 	graph text NOT NULL,
		 	UNIQUE(subject, predicate, object, graph)
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