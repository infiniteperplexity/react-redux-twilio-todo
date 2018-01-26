let user = "TEST";
//let user = "GLENN";
function reducer(state, action) {
	if (!state) {
		return {
			// application state
			app: {
				filters: ["Inbox","Repeating","Complete","All"],
				filter: "Inbox",
				modal: null
			},
			// persistent data
			tasks: {},
			lists: []
		};
	}
	let tasks, statuses;
	switch (action.type) {
		/// **** Actions that modify client state only ********
		case "SET_FILTER":
			return {...state, app: {...state.app, filter: action.filter}};
		// ****Actions that get or post data from the server
		case "SET_MODAL":
			return {...state, app: {...state.app, modal: action.modal}};
		case "INITIALIZE":
			getTriples();
			return state;
		// Parse triples into hierarchical object data
		case "GET_DATA":
			console.log("got data");
			console.log(action.data);
			let predicates = {};
			for (let {predicate: p} of action.data) {
				if (!predicates[p]) {
					predicates[p] = [];	
				}
			}
			for (let {subject: s, predicate: p, object: o} of action.data) {
				if (!predicates[p]) {
					predicates[p] = [];
				}
				predicates[p].push([s,o]);
			}
			tasks = {};
			statuses = {};
			let lists = [];
			for (let [s,o] of predicates.a) {
				if (o===":Task") {
					tasks[s] = {
						id: s,
						filters: {
							Inbox: true,
							Repeating: false,
							All: true,
							Completed: false,
							List: false
						}
					};
				} else if (o===":Status") {
					statuses[s] = {
						id: s,
						value: null,
						moment: null
					};
				} else if (o===":List") {
					//do something
				}
			}
			for (let [s,o] of predicates["rdfs:value"]) {
				if (s in statuses) {
					statuses[s].value = o;
				}
			}
			for (let [s,o] of predicates[":moment"]) {
				if (s in statuses) {
					statuses[s].moment = o;
				}
			}
			for (let [s,o] of predicates[":completed"]) {
				if (s in tasks) {
					tasks[s].completed = statuses[o];
				}
			}
			for (let [s,o] of predicates[":occasion"]) {
				if (s in tasks) {
					let task = tasks[s];
					task.occasions = task.occasions || {};
					task.occasions[statuses[o].moment] = statuses[o];
				}
			}
			for (let [s,o] of predicates[":repeats"]) {
				if (s in tasks) {
					tasks[s].repeats = o;
				}
			}
			for (let [s,o] of predicates["rdfs:label"]) {
				if (s in tasks) {
					tasks[s].label = o;
				}
			}
			for (let [s,o] of predicates[":created"]) {
				if (s in tasks) {
					tasks[s].created = o;
				}
			}
			for (let [s,o] of predicates[":inputs"]) {
				if (s in tasks) {
					tasks[s].inputs = o;
				}
			}
			for (let key in tasks) {
				let task = tasks[key];
				if (task.completed) {
					task.filters.Completed = true;
					task.filters.Inbox = false;
				} else if (task.repeats) {
					task.filters.Repeating = true;
					task.filters.Inbox = false;
				}
			}
			function staticList(name) {
				tasks["$"+name] = {
					id: "$"+name,
					label: name,

				}
			}
			let staticLists = ["Inbox","Repeating","Completed","All","Lists"];
			for (let list of staticLists) {
				tasks["$"+list] = {
					id: "$"+list,
					label: list,
					tags: ["$List"],
					filters: {

					}
				}
				for (let filter of staticLists) {
					tasks["$"+list].filters[filter] = (filter==="Lists" || filter==="All") ? true : false;
				}
				lists.push(tasks["$"+list]);
			}
			console.log("got tasks");
			console.log(tasks);
			return {...state, tasks: tasks, lists: lists};
		case "MODIFY_DATA":
			// delete, add, or modify tasks
			console.log("modifying data");
			console.log(action);
			tasks = {...state.tasks};
			for (let id of action.delete) {
				delete tasks[id];
			}
			for (let task of action.modify) {
				tasks[task.id] = task;
			}
			for (let task of action.add) {
				tasks[task.id] = task;
			}
			// parse hierarchical data into triples
			let triples = [];
			for (let id in tasks) {
				// skip static tasks
				if (id[0]==="$") {
					continue;
				}
				let task = tasks[id];
				triples.push([id, "a", ":Task"]);
				triples.push([id, "rdfs:label", task.label]);
				triples.push([id, ":created", task.created]);
				triples.push([id, ":inputs", task.inputs]);
				if (task.repeats) {
					triples.push([id, ":repeats", task.repeats]);
				}
				if (task.completed) {
					triples.push([id, ":completed", task.completed.id]);
					triples.push([task.completed.id, "a", ":Status"]);
					triples.push([task.completed.id, "rdfs:value", task.completed.value]);
					triples.push([task.completed.id, ":moment", task.completed.moment]);
				}
				if (task.occasions) {
					for (let key in task.occasions) {
						let o = task.occasions[key];
						triples.push([id, ":occasion", o.id]);
						triples.push([o.id, "a", ":Status"]);
						triples.push([o.id, "rdfs:value", o.value]);
						triples.push([o.id, ":moment", o.moment]);
					}
				}
			}
			updateTriples(triples);
			return state;
		case "FAIL_UPDATE":
			alert("database update failed.");
			console.log(res);
			return state;
		default:
			return state;
	}
}
let store = Redux.createStore(reducer);
store.dispatch({type: "INITIALIZE"});

// **** database connection functions
// GET
function getTriples() {
	fetch('db.'+user).then((res)=>{
		if (res.status!==200) {
	        store.dispatch({type: "FAIL_UPDATE", response: res});
	    } else {
			res.json().then((data)=>store.dispatch({type: "GET_DATA", data: data}));
		}
	});
}
// POST
function updateTriples(triples) {
	console.log("sending data");
	console.log(triples);
	fetch('db.'+user, {
		method: 'POST',
		headers: new Headers({'Content-Type': 'application/json;charset=UTF-8'}),
		body: JSON.stringify(triples)
	}).then((res)=>{
		if (res.status!==200) {
	        store.dispatch({type: "FAIL_UPDATE", response: res});
	    } else {
			res.json().then((data)=>store.dispatch({type: "GET_DATA", data: data}));
		}
	});
}

