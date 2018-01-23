let parser = N3.Parser();
let preparsed = {
  rdf: 'http://www.w3.org/1999/02/22-rdf-syntax-ns#',
  rdfs: 'http://www.w3.org/2000/01/rdf-schema#',
  owl: 'http://www.w3.org/2002/07/owl#',
  dc: 'http://purl.org/dc/elements/1.1/',
  xsd: 'http://www.w3.org/2001/XMLSchema#',
}
preparsed[''] = "#";
let nstore = N3.Store({prefixes: preparsed});
let writer = N3.Writer({prefixes: preparsed});


let user = "TEST";
//let user = "GLENN";
let store;
let filters = {
	complete: function(task) {
		return (task in this.props.completed && !(task in this.props.repeating));
	},
	inbox: function(task) {
		return (!(task in this.props.completed) && !(task in this.props.repeating));
	},
	repeating: function(task) {
		return (task in this.props.repeating);
	},
	all: function(task) { return true;}
}
function reducer(state, action) {
	if (!state) {
		return {
			// application state
			triples: N3.Store({prefixes: preparsed});
			filters: filters,
			filter: "inbox",
			// data sorted usefully
			tasks: [],
			labels: {},
			inputs: {},
			completed: {},
			repeating: {},
			// raw data
			triples: []
		};
	}
	switch (action.type) {
		case "INITIALIZE":
			getTriples();
			return state;
		case "SET_FILTER":
			return {...state, filter: action.filter};
		case "SELECT_TASK":
			let task = {
				id: action.id,
				label: state.labels[action.id],
				completed: state.completed[action.id],
				created: state.created[action.id],
				repeats: state.repeating[action.id]
			};
			return {...state, selected: task};
		case "ADD_TRIPLES":
			// add some triples
			updateTriples(state.triples.concat(action.triples));
			return state;
		case "DELETE_IDS":
			// delete all triples with that task ID as the subject or the predicate
			if (action.ids.length===0) {
				return;
			}
			updateTriples(state.triples
				.filter(([subject, predicate, object])=>(action.ids.indexOf(subject)===-1 && action.ids.indexOf(object)===-1)));
			return state;
		case "COMPLETE_IDS":
			let completed = action.ids.map((id)=>([id, ":completed",Date()]));
			updateTriples(state.triples
					.filter(([subject, predicate, object])=>(action.ids.indexOf(subject)===-1 || predicate!==":completed"))
					.concat(completed)
			);
			return state;
		case "MODIFY_TASKS":
			updateTriples();
			return state;
		case "DB_UPDATE":
			let predicates = {
				tasks: [],
				labels: {},
				inputs: {},
				statuses: {},
				completed: {},
				repeating: {},
				created: {}
			}
			let triples = [];
			for (let {subject, predicate, object} of action.data) {
				switch (predicate) {
					case "a":
						if (object===":Task") {
							predicates.tasks.push(subject);
						}
						break;
					case "rdfs:label":
						predicates.labels[subject] = object;
						break;
					case ":completed":
						predicates.completed[subject] = object;
						break;
					case ":status":
						predicates.statuses[subject] = predicates.statuses[subject] || {};
						predicates.statuses[subject][object] = predicates.statuses[subject][object] || {};
						break;
					case ":created":
						predicates.created[subject] = object;
						break;
					case ":repeats":
						predicates.repeating[subject] = object;
						break;
					case ":inputs":
						predicates.inputs[subject] = object;
						break;
					case "rdfs:value":
						break;
					default:
						// do nothing
				}				
				triples.push([subject, predicate, object]);
			}
			return {...state, ...predicates, triples: triples};
		case "FAIL_UPDATE":
			alert("database update failed.");
			console.log(res);
			return state;
		default:
			return state;
	}
}
store = Redux.createStore(reducer);


// database connection functions
function getTriples() {
	fetch('db.'+user).then((res)=>{
		if (res.status!==200) {
	        store.dispatch({type: "FAIL_UPDATE", response: res});
	    } else {
			res.json().then((data)=>store.dispatch({type: "DB_UPDATE", data: data}));
		}
	});
}

function updateTriples(triples) {	
	triples = triples || store.getState().triples;
	fetch('db.'+user, {
		method: 'POST',
		headers: new Headers({'Content-Type': 'application/json;charset=UTF-8'}),
		body: JSON.stringify(triples)
	}).then((res)=>{
		if (res.status!==200) {
	        store.dispatch({type: "FAIL_UPDATE", response: res});
	    } else {
			res.json().then((data)=>store.dispatch({type: "DB_UPDATE", data: data}));
		}
	});
}

store.dispatch({type: "INITIALIZE"});

// we need a salad spinner