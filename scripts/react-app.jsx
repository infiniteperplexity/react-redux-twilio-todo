$(function () {
  $('[data-toggle="tooltip"]').tooltip()
});


let MOBILE = (window.innerWidth<2800);

class Container extends React.Component {
	render() {
		if (MOBILE) {
			return (<p>Hello {window.innerWidth}-pixel world!</p>)
		} else {
			return (
				<div className="taskapp">
						<TaskMenu {...this.props} />
						<TaskDisplay {...this.props} />
						<TaskModal {...this.props} />
				</div>
			);
		}
	}
}

let App = ReactRedux.connect(
	(state) => ({app: state.app, tasks: state.tasks}),
	(dispatch) => ({
		setControl: (control, value) => {
			if (control==="filter" && value!==store.getState().app.filter) {
				window.history.pushState({filter: value},"");
			}
			dispatch({type: "SET_CONTROL", control: control, value: value});
		},
		showDetails: (id) => dispatch({type: "SHOW_DETAILS", id: id}),
		modifyTask: (task) => dispatch({type: "MODIFY_DATA", modify: [task]}),
		deleteTask: (id) => dispatch({type: "MODIFY_DATA", delete: [id]}),
		completeTask: (id) => {
			let tasks = {...store.getState().tasks};
			let task = {...tasks[id]};
			if (task.repeats==="instantly") {
				task.clicked = moment().unix();
			} else {
				task.completed = {
					id: uuid.v4(),
					moment: moment().unix(),
					value: true
				}
			}
			return dispatch({type: "MODIFY_DATA", modify: [task]});
		},
		changeList: (task, oldlist, newlist) => {
			let noMove = ["$Everything","$Repeating","$Clickers","$Completed","$Static","$Inbox","$Lists"];
			let noAdd = ["$Everything","$Repeating","$Clickers","$Completed","$Static"];
			let noRemove = ["$Everything","$Repeating","$Clickers","$Completed","$Static"];
			if (noMove.indexOf(task.id)!==-1 || noRemove.indexOf(oldlist.id)!==-1 || noAdd.indexOf(newlist.id)!==-1) {
				console.log("don't be tryin' nothing crazy for now...");
				return;
			}
			oldlist = {...oldlist};
			newlist = {...newlist};
			newlist.subtasks = newlist.subtasks || [];
			let oldsub = [...oldlist.subtasks];
			let newsub = [...newlist.subtasks];
			oldsub.splice(oldsub.indexOf(task),1);
			newsub.push(task);
			oldlist.subtasks = oldsub;
			newlist.subtasks = newsub;
			return dispatch({type: "MODIFY_DATA", modify: [oldlist, newlist]});
		},
		addTask: (args) => {
			args = args || {};
			let tasks = store.getState().tasks;
			let task = {
				id: args.id || uuid.v4(),
				created: args.moment || moment().unix(),
				inputs: args.inputs || "check"
			};
			task = {...task, ...args};
			let inbox = {...tasks.$Inbox, subtasks: tasks.$Inbox.subtasks.concat(task)};
			let memberships = [];
			if (args.memberof) {
				let tasks = store.getState().tasks;
				for (let listid of args.memberof) {
					tasks[listid].subtasks = tasks[listid].subtasks || [];
					let list = {...tasks[listid], subtasks: tasks[listid].subtasks.concat(task)};
					memberships.push(list);
				}
				delete task.memberof;
			}
			return dispatch({type: "MODIFY_DATA", add: [task], modify: memberships});
		},
		sortTask: (taskid, listid, n) => {
			// immediately sort all completed tasks to the bottom?
			let task = store.getState().tasks[taskid];
			let list = store.getState().tasks[listid];
			let index = list.subtasks.indexOf(task);
			if (index+n < 0 || index+n >= list.subtasks.length) {
				return;
			} else {
				let newlist = [];
				for (let item of list.subtasks) {
					newlist.push(item);
				}
				newlist[index] = newlist[index+n];
				newlist[index+n] = task;
				let incomplete = newlist.filter(t=>!t.completed);
				let completed = newlist.filter(t=>t.completed);
				newlist = incomplete.concat(completed);
				return dispatch({type: "MODIFY_DATA", modify: [{...list, subtasks: newlist}], });
			}
		}
	})
)(Container);

window.onpopstate = function(event) {
   	if (event.state) {
  		store.dispatch({type: "SET_CONTROL", control: "filter", value: event.state.filter});
  	}
};
window.history.replaceState({filter: "$Inbox"},"title", window.location);
let destination = document.querySelector("#container");


ReactDOM.render(
	<ReactRedux.Provider store={store}>
		<App />
	</ReactRedux.Provider>,
	destination
);