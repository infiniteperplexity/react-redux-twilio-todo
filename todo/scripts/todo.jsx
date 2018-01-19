let user = "glenn";
let store;
function reducer(state, action) {
	if (!state) {
		return {
			filters: [],
			triples: [],
			tasks: [],
			labels: {},
			completed: {}
		};
	}
	switch (action.type) {
		case "INITIALIZE":
			getTriples();
			return state;
		case "SET_FILTERS":
			let filters = action.filters;
			return {...state, filters: filters};
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
				completed: {}
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

class App extends React.Component {
	render() {
		return (
			<div className="taskapp">
				<TaskMenuHOC />
				<TaskDisplayHOC />
				<TaskDetailsHOC />
			</div>
		);
	}
}

class TaskDisplay extends React.Component {
	addTask = (e) => {
		e.preventDefault();
		let label = this._label.value;
		if (label!=="") {
			let task = uuid.v4();
			let triples = [
				[task,"a",":Task"],
				[task,":created",Date()],
				[task,"rdfs:label",label]
			];
			this._label.value = "";
			this.props.addTriples(triples);
		}
	}
	deleteTask = (id) => {
		this.props.deleteTasks([id]);
	}
	completeTask = (id) => {
		this.props.completeTasks([id]);
	}
	render() {
		// this system works pretty well
		let tasks = this.props.tasks;
		for (let filter of this.props.filters) {
			tasks = tasks.filter(filter.bind(this));
		}
		let labels = this.props.labels;
		let items = tasks.map((taskid,i)=>(
				<li key={i}>
					<button onClick={()=>this.completeTask(taskid)}>{"\u2714"}</button>
					<button onClick={()=>this.deleteTask(taskid)}>{"\u274C"}</button>
					{labels[taskid]}
				</li>
			)
		);
		return (
			<div className="taskdisplay appframe">
				<form onSubmit={this.addTask}>
		        	<input ref={(e)=>this._label=e} placeholder="enter task." />
		        	<button type="submit">add</button>
		        	<ul>
		        		{items}
		        	</ul>
		        </form>
			</div>
		);
	}
}

let TaskDisplayHOC = ReactRedux.connect(
	(state) => ({	tasks: state.tasks,
					labels: state.labels,
					filters: state.filters,
					completed: state.completed
				}),
	(dispatch) => ({
		addTriples: (triples) => dispatch({type: "ADD_TRIPLES", triples: triples}),
		deleteTasks: (ids) => dispatch({type: "DELETE_IDS", ids: ids}),
		completeTasks: (ids) => dispatch({type: "COMPLETE_IDS", ids: ids})
	})
)(TaskDisplay);



class TaskMenu extends React.Component {
	constructor(props, context) {
		super(props, context);
		this.props.setFilters([this.filterIncomplete]);
	}
	filterComplete(task) {
		return (task in this.props.completed);
	}
	filterIncomplete(task) {
		return (!(task in this.props.completed));
	}
	handleChange = (e) => {
		switch(e.target.value) {
			case "incomplete":
				this.props.setFilters([this.filterIncomplete]);
				return;
			case "complete":
				this.props.setFilters([this.filterComplete]);
				return;
			default:
				return;
		}
	}
	render() {
		return (
			<div className="taskmenu appframe">
				<form>
					<input 	type="radio"
							value="incomplete"
							checked={this.props.filters.indexOf(this.filterIncomplete)!==-1}
							onChange={this.handleChange}
					/>To-Do<br />
					<input 	type="radio"
							value="complete"
							checked={this.props.filters.indexOf(this.filterComplete)!==-1}
							onChange={this.handleChange}
					/>Complete
				</form>
			</div>
		);
	}
}

let TaskMenuHOC = ReactRedux.connect(
	(state) => ({filters: state.filters}),
	(dispatch) => ({
		setFilters: (filters) => dispatch({type: "SET_FILTERS", filters: filters})
	})
)(TaskMenu);

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

store.dispatch({type: "INITIALIZE"});