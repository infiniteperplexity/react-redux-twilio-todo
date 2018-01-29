$(function () {
  $('[data-toggle="tooltip"]').tooltip()
})

let actions = {
	addTask: (args)=>{

		task = {...task, ...args};
		dispatch({type: "MODIFY_DATA", add: [task]})
	}
}
/*
	Okay...little unclear on where methods should go?
	So, I think this controlled vs uncontrolled components thing might be key.
	Controlled components seem half jenky...the value= half is not, but the handler part is.


*/


function TaskCalendar(id, props) {}


function TaskDisplay({tasks, app, ...rest}) {
	if (!tasks) {
		return null;
	}
	let filter = app.filter;
	let filtered = [];
	if (tasks[filter]) {
		filtered = tasks[filter].subtasks || [];
	}
	return 	(
		<div className="taskdisplay appframe">
			<TaskToolbar />
			<TaskList filtered={filtered} {...rest} />
		</div>
	);
}


// several tricky things here...
// ...
function TaskToolbar(props) {
	return (
		<form onSubmit={this.addFilteredTask}>
			<input type="text" className="form-control" onChange={} placeholder="Enter Task." />
			<button type="submit" className="btn">Add Task.</button>
		</form>
	);
}
function TaskList(props) {
	let tasks = props.filtered;
	let listing = props.filtered.map((task, i) => 
		<TaskListing	key={i}
						label={task.label}
						id={task.id}
						{...props}
		/>
	);
	return (
		<div>
			{listing}
		</div>
	);
}

//<div >
function TaskListing({label, id, showModal, handleChange, completeTask, sortTask, deleteTask}) {
	console.log("testing");
	return (
		<div style={{overflow: "hidden"}}>
			{label}
			<span style={{float: "right"}}>
				<TaskButton id={id} onClick={completeTask} tooltip="complete task">{"\u2713"}</TaskButton>
				<TaskButton id={id} onClick={showModal} tooltip="inspect/modify">{"?"}</TaskButton>
				<TaskButton id={id} onClick={x=>handleChange("filter",x)} tooltip="show subtasks">{"\u2261"}</TaskButton>			
				<TaskButton id={id} onClick={x=>sortTask(x,-1)} tooltip="sort task up">{"\u2191"}</TaskButton>
				<TaskButton id={id} onClick={x=>sortTask(x,+1)} tooltip="sort task down">{"\u2193"}</TaskButton>
				<TaskButton id={id} onClick={deleteTask} tooltip="delete task">{"\u2717"}</TaskButton>
			</span>
		</div>
	);
}

function TaskButton({id, onClick, tooltip, children}) {
	return (
		<button className="btn"
				onClick={e=>{
					e.preventDefault();
					onClick(id);
				}}
				onMouseOver={(e)=>(e.target.querySelector("span").style.visibility="visible")}
				onMouseLeave={(e)=>(e.target.querySelector("span").style.visibility="hidden")}
		>
			{children}
			<span style={{
				position: "absolute",
				visibility: "hidden",
				zIndex: "1",
				width: "120px",
				marginLeft: "-120px",
				backgroundColor: "white"
			}}>
				{tooltip}
			</span>
		</button>
	);
}

class Container extends React.Component {
	render() {
		return (
			<div className="taskapp">
					<TaskMenu {...this.props} />
					<TaskDisplay {...this.props} />
			</div>
		);
	}
}
let App = ReactRedux.connect(
	(state) => ({app: state.app, tasks: state.tasks}),
	(dispatch) => ({
		handleChange: (control, value) => dispatch({type: "CONTROL_APP", control: control, value: value}),
		setFilter: (filter) => dispatch({type: "SET_FILTER", filter: filter}),
		showModal: (modal) => dispatch({type: "SET_MODAL", modal: modal}),
		closeModal: () => dispatch({type: "SET_MODAL", modal: null}),
		modifyTask: (task) => dispatch({type: "MODIFY_DATA", modify: [task]}),
		deleteTask: (id) => dispatch({type: "MODIFY_DATA", delete: [id]}),
		completeTask: (id) => {
			let tasks = {...store.getState().tasks};
			let completed = {
				id: uuid.v4(),
				moment: moment().unix(),
				value: true
			}
			let task = {...tasks[id], completed: completed};
			return dispatch({type: "MODIFY_DATA", modify: [task]});
		},
		addFilteredTask: (args) => {
			let task = {
				id: uuid.v4(),
				created: moment().unix(),
				inputs: "check"
			};
			let tasks = this.props.tasks;
			let filter = this.props.app.filter;
			if (filter==="$Repeating") {
				task.repeats = "daily"
			} else if (filter==="$Clickers") {
				task.repeats = "instantly";
			} else if (filter==="$Static" || filter==="$Completed") {
				return dispatch({type: null});
			} else if (filter==="$Everything") {
				let inbox = {...tasks.$Inbox, subtasks: tasks.$Inbox.subtasks.concat(task)};
				return dispatch({type: "MODIFY_DATA", add: [task], modify: [inbox]});
			} else {
				let list = {...tasks[filter], subtasks: tasks[filter].subtasks.concat(task)};
				return dispatch({type: "MODIFY_DATA", add: [task], modify: [list]});
			}
			return dispatch({type: "MODIFY_DATA", add: [task]});
		},
		sortTask: (id, n) => {
			let filter = store.getState().app.filter;
			let list = store.getState().tasks[filter];
			let index = list.subtasks.indexOf(store.getState().tasks[id]);
			if (index+n < 0 || index+n >= list.subtasks.length) {
				return;
			} else {
				let newlist = [];
				for (let item of list.subtasks) {
					newlist.push(item);
				}
				newlist[index] = newlist[index+n];
				newlist[index+n] = store.getState().tasks[id];
				return dispatch({type: "MODIFY_DATA", modify: [{...list, subtasks: newlist}], });
			}
		}
	})
)(Container);


let destination = document.querySelector("#container");
ReactDOM.render(
	<ReactRedux.Provider store={store}>
		<App />
	</ReactRedux.Provider>,
	destination
);