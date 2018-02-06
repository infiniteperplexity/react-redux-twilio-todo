import React from 'react';
import moment from 'moment';
import {TaskList} from './react-tasklist';
import TaskCalendar from './react-calendar';

/********* The big element that contains lists and calendars ****************/
function TaskDisplay({tasks, app, ...rest}) {
	if (!tasks) {
		return null;
	}
	let filter = app.filter;
	if (!tasks[filter]) {
		// usually only when back button is involved
		console.log("filter has been deleted, use inbox instead");
		rest.setControl("filter","$Inbox");
		filter = "$Inbox";
	}
	let filtered = [];
	if (tasks[filter]) {
		filtered = tasks[filter].subtasks || [];
	}
	if (filter!=="$Completed") {
		filtered = filtered.filter(task=>!task.completed);
	}
	let listing;
	if (filter==="$Calendar") {
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
		if (this.props.app.toolbar.label!=="") {
			let filter = this.props.app.filter;
			let args = {label: this.props.app.toolbar.label};
			if (filter==="$Repeating" || filter==="$Calendar") {
				args.repeats = "daily";
			} else if (filter==="$Clickers") {
				args.repeats = "instantly";
				args.clicked = moment().unix();
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
				<input type="text" className="form-control" value={this.props.app.toolbar.label} onChange={this.handleChange} placeholder="Enter Task." />
				<button type="submit" className="btn">Add Task.</button>
			</form>
		);
	}
}

export {TaskDisplay, TaskToolbar}