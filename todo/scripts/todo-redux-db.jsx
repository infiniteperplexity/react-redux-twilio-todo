let user = "glenn";
let store;
function reducer(state, action) {
	if (!state) {
		return {
			// application state
			filters: [],
			selected: null,
			// data sorted usefully
			tasks: [],
			labels: {},
			completed: {},
			// raw data
			triples: []
		};
	}
	switch (action.type) {
		case "INITIALIZE":
			getTriples();
			return state;
		case "SET_FILTERS":
			let filters = action.filters;
			return {...state, filters: filters};
		case "SELECT_TASK":
			let task = {
				id: action.id,
				label: state.labels[action.id],
				completed: state.completed[action.id],
				created: state.created[action.id]
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
				completed: {},
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
					case ":created":
						predicates.created[subject] = object;
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