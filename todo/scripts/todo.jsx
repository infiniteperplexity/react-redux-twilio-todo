/*
Let's talk about state, baby.

So we technically need the following things:
- All "list-level" tasks.
- All current-filter tasks.
- The details of any currently-selected task.



*/
let user = "glenn";
let store;
function reducer(state, action) {
	if (!state) {
		return {tasks: []};
	}
	switch (action.type) {
		case "INITIALIZE":
			getTasks();
			return state;
		case "ADD_TASK":
			// do stuff
			updateTasks();
			return state;
		case "DELETE_TASK":
			// do stuff
			updateTasks();
			return state;
		case "MODIFY_TASK":
			// do stuff
			updateTasks();
			return state;
		case "DB_UPDATE":
			let tasks = action.data.map((e)=>{
				let {subject, predicate, object} = e;
				return [subject, predicate, object];
			});
			return {...state, tasks: tasks};
		case "FAIL_UPDATE":
			alert("database update failed.");
			console.log("database update failed.");
			return state;
		default:
			return state;
	}
}
store = Redux.createStore(reducer);

// database connection functions
function getTasks() {
	fetch('db.'+user).then((res)=>{
		if (res.status!==200) {
	        store.dispatch({type: "FAIL_UPDATE"});
	    } else {
			res.json().then((data)=>store.dispatch({type: "DB_UPDATE", data: data}));
		}
	});
}

function updateTasks(tasks) {
	tasks = tasks || store.getState().tasks;
	fetch('db.'+user, {
		method: 'POST',
		headers: new Headers({'Content-Type': 'application/json;charset=UTF-8'}),
		body: JSON.stringify(tasks)
	}).then((res)=>{
		if (res.status!==200) {
	        store.dispatch({type: "FAIL_UPDATE"});
	    } else {
			res.json().then((data)=>store.dispatch({type: "DB_UPDATE", data: data}));
		}
	});
}



class App extends React.Component {
	render() {
		return (
			<div className="taskapp">
				<TaskMenuHOC />
				<div className="taskmiddle">
					<TaskDisplayHOC />
					<TaskListHOC />
				</div>
				<TaskDetailsHOC />
			</div>
		);
	}
}

class TaskDisplay extends React.Component {
	render() {
		return (
			<div className="taskdisplay appframe">
			</div>
		);
	}
}

let TaskDisplayHOC = ReactRedux.connect(
	(state) => ({}),
	(dispatch) => ({})
)(TaskDisplay);



class TaskMenu extends React.Component {
	render() {
		return (
			<div className="taskmenu appframe">
			
			</div>
		);
	}
}

let TaskMenuHOC = ReactRedux.connect(
	(state) => ({}),
	(dispatch) => ({})
)(TaskMenu);


class TaskList extends React.Component {
	render() {
		return (
			<div className="tasklist appframe">
			
			</div>
		);
	}
}

let TaskListHOC = ReactRedux.connect(
	(state) => ({}),
	(dispatch) => ({})
)(TaskList);

class TaskDetails extends React.Component {
	render() {
		return (
			<div className="taskdetails appframe">
			
			</div>
		);
	}
}

let TaskDetailsHOC = ReactRedux.connect(
	(state) => ({}),
	(dispatch) => ({})
)(TaskDetails);

let destination = document.querySelector("#container");
ReactDOM.render(
	<ReactRedux.Provider store={store}>
		<App />
	</ReactRedux.Provider>,
	destination
);

let exampletasks = [
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

setTimeout(()=>{
	updateTasks(exampletasks);
},2000);