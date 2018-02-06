import React from 'react';
import moment from 'moment';
import TaskMenu from './react-taskmenu';
import {TaskToolbar} from './react-taskdisplay';

class MobileMenu extends React.Component {
	handleChange = (event)=> {
		this.props.setControl("filter",event.target.value);
	}
	render() {
		let tasks = this.props.tasks;
		let app = this.props.app;
		let setControl = this.props.setControl;
		if (!tasks) {
			return null;
		}
		let statics = tasks.$Static.subtasks.map((list,i)=>
			<option key={i} value={list.id}>{list.label}</option>
		);
		let lists = tasks.$Lists.subtasks.map((list,i)=>
			<option key={i} value={list.id}>{list.label}</option>
		);
		return (
			<div class="taskmenu">
				<select value={this.props.app.filter}
              			onChange={this.handleChange}
      			>
	      			{statics}
	      			<option disabled="true">---------------------</option>
	      			{lists}
      			</select>
			</div>
		);
	}
}



/********* The big element that contains lists and calendars ****************/
function MobileDisplay({tasks, app, ...rest}) {
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
	listing = <MobileList app={app} tasks={tasks} filtered={filtered} {...rest} />;
	return 	(
		<div className="taskdisplay">
			<TaskToolbar app={app} {...rest} />
			{listing}
		</div>
	);
}

function MobileList(props) {
	let tasks = props.filtered;
	let listing = props.filtered.map((task, i) => 
		<MobileCard	key={i}
					n={i}
					label={task.label}
					id={task.id}
					{...props}
		/>
	);
	let ts = props.tasks;
	if (props.app.filter==="$Clickers") {
		listing.sort((a,b)=>{
			a = parseInt(ts[a.props.id].clicked);
			b = parseInt(ts[b.props.id].clicked);
			console.log(a);
			console.log(b);
			if (a < b) {
				return -1;
			} else if (a > b) {
				return +1;
			} else {
				return 0;
			}
		});
	}
	return (
		<div>
			{listing}
		</div>
	);
}

function MobileCard(props) {
	let task = props.tasks[props.id];
	let id = props.id;
	let app = props.app;
	let badge = null;
	if (task.repeats==="instantly") {
		if (!task.clicked) {
			task.clicked = task.created;
		}
		let then = moment(task.clicked,"X");
		let now = moment();
		let days = now.diff(then,"days");
		badge = <div className="badge badge-primary">{days}</div>;
	}
	return (
		<div	taskid={id}
				style={{
					className: "border border-dark",
					overflow: "hidden",
					backgroundColor: (props.n%2===0) ? "#FFFFEE" : "#EEEEFF"
				}}
		>
			{props.label}
			{badge}
		</div>
	);
}

export {MobileMenu, MobileDisplay};