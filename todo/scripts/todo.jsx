

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
				test
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
				test
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
				test
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
				test
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