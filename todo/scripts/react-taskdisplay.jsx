
/********* The big element that contains lists and calendars ****************/
function TaskDisplay({tasks, app, ...rest}) {
	if (!tasks) {
		return null;
	}
	let filter = app.filter;
	let filtered = [];
	if (tasks[filter]) {
		filtered = tasks[filter].subtasks || [];
	}
	let listing;
	if (filter==="$Repeating") {
		listing = <TaskCalendar app={app} tasks={tasks} filtered={filtered} {...rest} />;
	} else {
		listing = <TaskList app={app} tasks={tasks} filtered={filtered} {...rest} />;
	}
	return 	(
		<div className="taskdisplay appframe">
			<TaskToolbar app={app} {...rest} />
			{listing}
		</div>
	);
}

/******* The toolbar for lists and calendars **************/
class TaskToolbar extends React.Component {
	handleChange = (event) => {
		event.preventDefault();
		let toolbar = {...this.props.app.toolbar, label: event.target.value};
		this.props.setControl("toolbar",toolbar);
	}
	handleSubmit = (event) => {
		event.preventDefault();
		console.log(this.props.app.toolbar.label);
		if (this.props.app.toolbar.label!=="") {
			let filter = this.props.app.filter;
			let args = {label: this.props.app.toolbar.label};
			if (filter==="$Repeating") {
				args.repeats = "daily";
			} else if (args.filter==="$Clickers") {
				args.repeats = "instantly";
			} else if (filter==="$Everything") {
				args.memberof = ["$Inbox"];
 			} else {
 				args.memberof = [filter];
 			}
 			this.props.addTask(args);
		}
		let toolbar = {...this.props.app.toolbar, label: ""};
		this.props.setControl("toolbar",toolbar);
	}
	render() {
		return (
			<form onSubmit={this.handleSubmit}>
				<input type="text" className="form-control" value={this.props.app.addTaskLabel} onChange={this.handleChange} placeholder="Enter Task." />
				<button type="submit" className="btn">Add Task.</button>
			</form>
		);
	}
}



	// inspectTask = (id) => {
	// 	// for now...let's allow changing the label.
	// 	let label, inputs, list;
	// 	let children =
	// 		<div>
	// 			<input type="text" ref={(e)=>(label=e)} defaultValue={this.props.tasks[id].label} />
	// 			<input type="checkbox" ref={(e)=>(list=e)} defaultChecked={this.props.tasks[id].list!==undefined} />
	// 			<select ref={(e)=>(inputs=e)} defaultValue={this.props.tasks[id].inputs}>
	// 			    <option value="check">Check</option>
	// 			    <option value="number">Number</option>
	// 			</select>
	// 		</div>
	// 	;
	// 	// applies only to static lists for now
	// 	if (id[0]==="$") {
	// 		children = <div>
	// 			<input type="text" ref={(e)=>(label=e)} readOnly="true" value={this.props.tasks[id].label} />
	// 			<input type="checkbox" ref={(e)=>(list=e)} readOnly="true" checked="true" />
	// 		</div>
	// 		;
	// 		inputs = {
	// 			value: undefined
	// 		}
	// 	}
	// 	let modal = {
	// 		children: children,
	// 		submitModal: () => {
	// 			let task = {...this.props.tasks[id]};
	// 			task.label = label.value;
	// 			task.inputs = inputs.value;
	// 			if (!task.list && list.checked) {
	// 				task.list = [];
	// 			} else if (task.list && !list.checked) {
	// 				delete task.list;
	// 			}
	// 			this.props.modifyTask(task);
	// 		}
	// 	};
	// 	this.props.showModal(modal);
	// }