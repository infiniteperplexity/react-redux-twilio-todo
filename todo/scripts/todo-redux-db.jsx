let user = "TEST";
//let user = "GLENN";
function reducer(state, action) {
	if (!state) {
		return {
			// application state
			app: {
				filter: "$Inbox",
				modal: null
			},
			// persistent data
			tasks: {}
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
			tasks = {};
			statuses = {};
			// set up static lists
			let staticLists = ["Inbox","Repeating","Clickers","Completed","Everything","Static","Lists"];
			for (let list of staticLists) {
				tasks["$"+list] = {
					id: "$"+list,
					label: list,
					subtasks: [],
				}
			}
			for (let list of staticLists) {
				tasks.$Static.subtasks.push(tasks["$"+list]);
				tasks.$Everything.subtasks.push(tasks["$"+list]);
			}
			let predicates = {};
			for (let {predicate: p} of action.data) {
				if (!predicates[p]) {
					predicates[p] = [];	
				}
			}
			for (let p of [	
					"a",
					":completed",
					"rdfs:value",
					":moment",
					":occasion",
					":repeats",
					"rdfs:label",
					":created",
					":inputs"
				]) {
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
			for (let [s,o] of predicates.a) {
				if (o===":Task") {
					tasks[s] = {
						id: s
					};
				} else if (o===":Status") {
					statuses[s] = {
						id: s,
						value: null,
						moment: null
					};
				} else if (o===":List") {
					//don't implement yet
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
			// populate list items
			let lists = [];
			for (let nth in predicates) {
				let [_, ...n] = nth;
				if (_==="_" && !isNaN(n)) {
					for (let [s,o] of predicates[nth]) {
						tasks[s].subtasks = tasks[s].subtasks || [];
						tasks[s].subtasks[n] = tasks[o];
						if (lists.indexOf(tasks[s])===-1) {
							lists.push(tasks[s]);
						}
					}
				}
			}
			// clean up lists
			for (let list of lists) {
				list.subtasks = list.subtasks.filter((e)=>(e!==undefined))
			}
			// re-filter smartlists
			tasks.$Inbox.subtasks = tasks.$Inbox.subtasks.filter((task)=>(
				!task.completed && !task.repeats
			));
			tasks.$Repeating.subtasks = tasks.$Repeating.subtasks.filter((task)=>(
				task.repeats==="daily"
			));
			tasks.$Clickers.subtasks = tasks.$Clickers.subtasks.filter((task)=>(
				task.repeats==="instantly"
			));
			tasks.$Completed.subtasks = tasks.$Completed.subtasks.filter((task)=>(
				task.completed
			));
			// re-populate smartlists
			for (let id in tasks) {
				if (tasks[id].completed && tasks.$Completed.subtasks.indexOf(tasks[id])===-1) {
					tasks.$Completed.subtasks.push(tasks[id]);
				} else if (tasks[id].repeats==="daily" && tasks.$Repeating.subtasks.indexOf(tasks[id])===-1) {
					tasks.$Repeating.subtasks.push(tasks[id]);
				} else if (tasks[id].repeats==="instantly" && tasks.$Clickers.subtasks.indexOf(tasks[id])===-1) {
					tasks.$Clickers.subtasks.push(tasks[id]);
				} //else if (	id[0]!=="$" && tasks.$Inbox.subtasks.indexOf(tasks[id])===-1) {
				//	tasks.$Inbox.subtasks.push(tasks[id]);
				//}
				if (tasks.$Everything.subtasks.indexOf(tasks[id])===-1) {
					tasks.$Everything.subtasks.push(tasks[id]);
				}
			}
			console.log("got tasks");
			console.log(tasks);
			return {...state, tasks: tasks};
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
				if (id==="$Static") {
					continue;
				}
				let t = tasks[id];
				// deal with list items...can store for static lists
				if (t.subtasks) {
					for (let i=0; i<t.subtasks.length; i++) {
						let subtask = t.subtasks[i];
						if (subtask===undefined) {
							console.log(t.subtasks);
						}
						//if (subtask.id[0]==="$")
						// this is actually an rdfs: thing I think
						triples.push([id, "_"+(i+1), subtask.id]);
					}
				}
				// skip the rest for static tasks
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

