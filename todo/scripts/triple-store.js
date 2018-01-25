// returns a wrapper th
function tripleStore(reduxStore) {
	let preparsed = {
	  rdf: 'http://www.w3.org/1999/02/22-rdf-syntax-ns#',
	  rdfs: 'http://www.w3.org/2000/01/rdf-schema#',
	  owl: 'http://www.w3.org/2002/07/owl#',
	  dc: 'http://purl.org/dc/elements/1.1/',
	  xsd: 'http://www.w3.org/2001/XMLSchema#',
	}
	preparsed[''] = '#';
	let store;
	rdfstore.create(function(e,s) {
		tripleStore.store = s; 
	 	s.registerDefaultProfileNamespaces();
	  	s.rdf.setPrefix('','');
	});
	function insertTurtle(turtle) {
		rdfstore.create((err,s)=>{
			if (err) {
				this.reduxStore.dispatch({type: "FAIL_UPDATE", response: err});
			} else {
			  	s.load("text/turtle",turtle,()=>{
			    	s.graph((err,g)=> {
			    		if (err) {
							reduxStore.dispatch({type: "FAIL_UPDATE", response: err});
						} else {
			      			s.insert(g);
			      			reduxStore.dispatch({type: "GOT_TRIPLES", triples: store});
			      		}
			    	});
			  	});
			  }
		});
	}
	function writeTurtle(triples, callback) {
		let writer = N3.Writer({prefixes: preparsed});
		writer.addTriples(triples.map((triple)=>(
			(Array.isArray(triple)) ? {subject: triple[0], predicate: triple[1], object: triple[2]} : triple
		)));
		writer.end((err, res)=>{
			if (err) {
				console.log("error: ",err);
			} else {
				callback(res);
			}
		});
	}

	function query(sparql, callback) {
	  store.execute('PREFIX : <#> \
	  	'+sparql, (err, results) => {
	  		//is this hopeless?  Does the asynch nature of this inheritently conflict with React?
	  });
	}

	function getRows() {
		fetch('db.'+reduxStore.getState().user).then((res)=>{
			if (res.status!==200) {
		        reduxStore.dispatch({type: "FAIL_UPDATE", response: res});
		    } else {
		    	// this should instead drop them in the triple store
				res.json().then((data)=>{
					writeTurtle(data, insertTurtle);
				}
			}
		});
	}

	function postRows() {
		reduxStore.graph((err, graph )=> {
			fetch('db.'+reduxStore.getState().user, {
				method: 'POST',
				headers: new Headers({'Content-Type': 'application/json;charset=UTF-8'}),
				// is this indeed correct?
				// it might need to be unpacked into an array
				body: JSON.stringify(graph)
				//body: JSON.stringify(graph.map(({s, o, j})=>[s,o,j]))
			}).then((res)=>{
				if (res.status!==200) {
					store.dispatch({type: "FAIL_UPDATE", response: res});
				} else {
					res.json().then((data)=>reduxStore.dispatch({type: "DB_UPDATE", data: data}));
				}
			});
		});
	}

	return store;
}