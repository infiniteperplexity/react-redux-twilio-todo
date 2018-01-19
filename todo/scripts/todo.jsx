/*
Let's talk about state, baby.

So we technically need the following things:
- All "list-level" tasks.
- All current-filter tasks.
- The details of any currently-selected task.



*/

function reducer(state, action) {
	if (!state) {
		return {};
	}
	switch (action.type) {
		case "BEGIN_ADD_TASK":
			return {...state};
		case "COMPLETE_ADD_TASK":
			return {...state};
		case "DELETE_TASK":
			return {...state};
		case "COMPLETE_ADD_TASK":
			return {...state};
		default:
			return state;
	}
}
let store = Redux.createStore(reducer);

// fake database connection for now
let connection = {
	query: function (str, callback) {
		results = {};
		setTimeout(function() {store.dispatch(callback(results));},50);
	}
};


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



let tasks;
fetch('db.glenn',{}).then((res)=>{
	if (res.status!==200) {
        console.log('Looks like there was a problem. Status Code: '+res.status);
        return;
    }
	res.json().then((data)=>{
		tasks = data;	
	});
});


let newtasks = [
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

function post() {
	let pargs = {
		method: 'POST',
		headers: new Headers({'Content-Type': 'application/json;charset=UTF-8'}),
		body: JSON.stringify(newtasks)
	};
	fetch('db.glenn',pargs).then((res)=>{
		if (res.status!==200) {
	        console.log('Looks like there was a problem. Status Code: '+res.status);
	        return;
	    }
		res.json().then((data)=>{
			tasks = data;
			console.log(tasks);	
		});
	});
}


setTimeout(post, 2000);