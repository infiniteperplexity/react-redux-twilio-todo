$(function () {
  $('[data-toggle="tooltip"]').tooltip()
});


class Container extends React.Component {
	render() {
		return (
			<div className="taskapp">
					<TaskMenu {...this.props} />
					<TaskDisplay {...this.props} />
					<TaskModal {...this.props} />
			</div>
		);
	}
}

let App = ReactRedux.connect(
	(state) => ({app: state.app, tasks: state.tasks}),
	(dispatch) => ({
		setControl: (control, value) => dispatch({type: "SET_CONTROL", control: control, value: value}),
		setModalControl: (control, property, value) => dispatch({type: "SET_CONTROL", property: property, control: control, value: value}),
		showModal: (id) => dispatch({type: "SET_MODAL", modal: id}),
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
					console.log(listid);
					let list = {...tasks[listid], subtasks: tasks[listid].subtasks.concat(task)};
					memberships.push(list);
				}
				delete task.memberof;
			}
			return dispatch({type: "MODIFY_DATA", add: [task], modify: memberships});
		},
		sortTask: (taskid, listid, n) => {
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