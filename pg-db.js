const pg = require('pg');

app.get('/dbinit', function (request, response) {
 	pg.connect(process.env.DATABASE_URL, function(err, client, done) {
    	// client.query('SELECT * FROM test_table', function(err, result) {
     //  		done();
     //  		if (err) {
     //  			console.error(err);
     //  			response.send("Error " + err);
     //  		} else {
     //  			response.render('pages/db', {results: result.rows});
     //  		}
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


 // .run(`INSERT INTO quads (
	// 	 	subject,
	// 	 	predicate,
	// 	 	object,
	// 	 	graph)
	// 	 	VALUES `
	// 	 	+ insert + ';')
	// 	 .close((e) => {
	// 		if (err) {
	// 		    return console.error(err.message);
	// 		}
	// 		console.log('Close the database connection.');
	// 	});
 //  		console.log('Connected to the on-disk SQlite database.');
	// });