import { createStore } from "redux";

//let user = "TEST";
let user = "GUEST";
function reducer(state, action) {
	if (!state) {
		return {
			// application state
			app: {
				filter: "$Inbox",
				toolbar: {
					label: ""
				},
				calendar: {
					date: ""
				},
				modify: {
					id: null,
					label: "",
					inputs: "",
					repeats: "",
					comments: "",
					clicked: ""
				}
			}
		};
	}
	let tasks, statuses, app;
	switch (action.type) {
		/// **** Action that modifies client state only ********
		case "SET_CONTROL":
			app = {...state.app};
			app[action.control] = action.value;
			console.log(action);
			console.log(app[action.control]);
			return {...state, app: app};
		case "SHOW_DETAILS":
			app = {...state.app};
			let task = state.tasks[action.id];
			app.modify = {
				id: action.id,
				label: task.label,
				inputs: task.inputs,
				repeats: task.repeats,
				comments: task.comments,
				clicked: task.clicked || task.created
			}
			return {...state, app};
		// ****Actions that get or post data from the server
		case "INITIALIZE":
			getTriples();
			return state;
		// Parse triples into hierarchical object data
		case "GET_DATA":
			tasks = {};
			statuses = {};
			// set up static lists
			let staticLists = ["Inbox","Calendar","Repeating","Clickers","Completed","Everything","Static","Lists"];
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
					":inputs",
					":comments",
					":clicked"
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
			for (let [s,o] of predicates[":comments"]) {
				if (s in tasks) {
					let task = tasks[s];
					task.comments = o;
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
			for (let [s,o] of predicates[":clicked"]) {
				if (s in tasks) {
					tasks[s].clicked = o;
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
				if (Array.isArray(n)) {
					n = n.join('');
				}
				if (_==="_" && !isNaN(n)) {
					for (let [s,o] of predicates[nth]) {
						tasks[s].subtasks = tasks[s].subtasks || [];
						if (tasks[s].subtasks.indexOf(tasks[o])===-1) {
							tasks[s].subtasks[n] = tasks[o];
						}
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
			tasks.$Calendar.subtasks = tasks.$Repeating.subtasks.filter((task)=>(
				task.repeats==="daily"
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
					tasks.$Calendar.subtasks.push(tasks[id]);
				} else if (tasks[id].repeats==="instantly" && tasks.$Clickers.subtasks.indexOf(tasks[id])===-1) {
					tasks.$Clickers.subtasks.push(tasks[id]);
				} //else if (	id[0]!=="$" && tasks.$Inbox.subtasks.indexOf(tasks[id])===-1) {
				//	tasks.$Inbox.subtasks.push(tasks[id]);
				//}
				if (tasks.$Everything.subtasks.indexOf(tasks[id])===-1) {
					tasks.$Everything.subtasks.push(tasks[id]);
				}
			}

			return {...state, tasks: tasks, triples: action.data.map(({subject, predicate, object})=>([subject, predicate, object]))};
		case "MODIFY_DATA":
			// delete, add, or modify tasks
			tasks = {...state.tasks};
			action.add = action.add || [];
			action.delete = action.delete || [];
			action.modify = action.modify || [];
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
				if (task.clicked) {
					triples.push([id, ":clicked", task.clicked]);
				}
				if (task.comments) {
					triples.push([id, ":comments", task.comments]);
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
			// this diffing may not be necessary if we continue to do things this way.
			let t0 = state.triples.map(e=>JSON.stringify(e));
			let t1 = triples.map(e=>JSON.stringify(e));
			let inserts = t1.filter(e=>!t0.includes(e));
			let deletes = t0.filter(e=>!t1.includes(e));
			inserts = inserts.map(e=>JSON.parse(e));
			deletes = deletes.map(e=>JSON.parse(e));
			//updateTriples(triples);
			updateTriples(inserts, deletes);
			// if we're going to fix this, we need to deal with list updating better
			//return state;
			return {...state, tasks: tasks};
		case "FAIL_UPDATE":
			alert("database update failed.");
			console.log(action.response);
			return state;
		default:
			return state;
	}
}
let store = createStore(reducer);
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
//function updateTriples(triples) {
function updateTriples(inserts, deletes) {
	// test for duplicates here
	// let duptest = triples.map(([s, p, o])=>JSON.stringify([s, p, o]));
	// duptest.sort();
	// for (let i=1; i<duptest.length; i++) {
	// 	if (duptest[i]===duptest[i-1]) {
	// 		console.log("apparent duplicate:");
	// 		console.log(duptest[i]);
	// 	}
	// }
	fetch('db.'+user, {
		method: 'POST',
		headers: new Headers({'Content-Type': 'application/json;charset=UTF-8'}),
		//body: JSON.stringify(triples)
		body: JSON.stringify({inserts: inserts, deletes: deletes})
	}).then((res)=>{
		if (res.status!==200) {
	        store.dispatch({type: "FAIL_UPDATE", response: res});
	    } else {
			res.json().then((data)=>store.dispatch({type: "GET_DATA", data: data}));
		}
	});
}

export default store;