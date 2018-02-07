import React from 'react';

function ListRadio({filter, id, setControl}) {
	return (
		<input	type="radio"
				value={id}
				checked={filter===id}
				onChange={e=>setControl("filter",e.target.value)}
		/>
	);
}


class TaskMenu extends React.Component {
	handleDrag = (event) => {
		// disable for now
		//event.dataTransfer.setData("text", event.target.getAttribute("taskid"));
	}
	allowDrop = (event) => {
		event.preventDefault();
		event.target.style.fontWeight = "bold";
	}
	dragLeave = (event) => {
		event.preventDefault();
		event.target.style.fontWeight = "normal";
	}
	handleDrop = (event) => {
		event.preventDefault();
		event.target.style.fontWeight = "normal";
		let json = event.dataTransfer.getData("text");
		let {taskid: id, listid: old} = JSON.parse(json);
		let tasks = this.props.tasks;
		let task = tasks[id];
		let oldlist = tasks[old];
		let newlist = tasks[event.target.getAttribute("taskid")];
		if (task===newlist) {
			return;
		}
		this.props.changeList(task, oldlist, newlist);
	}
	render() {
		let tasks = this.props.tasks;
		let app = this.props.app;
		let setControl = this.props.setControl;
		if (!tasks) {
			tasks = {};
			tasks.$Static = {};
			tasks.$Static.subtasks = ["Inbox","Calendar","Repeating","Clickers","Completed","Everything","Static","Lists"].map((label)=>{
				return {label: label, id: "$"+label};
			});
			tasks.$Lists = {subtasks: []};
		}
		let statics = tasks.$Static.subtasks.map((list,i)=>(
			<div	key={i}
					taskid={list.id}
					draggable="true"
					onDragStart={this.handleDrag}
					onDragOver={this.allowDrop}
					onDragLeave={this.dragLeave}
					onDrop={this.handleDrop}
			>
				<ListRadio id={list.id} filter={app.filter} setControl={setControl} />
				{list.label}
			</div>
		));
		let lists = tasks.$Lists.subtasks.map((list,i)=>(
			<div	key={i}
					taskid={list.id}
					draggable="true"
					onDragStart={this.handleDrag}
					onDragOver={this.allowDrop}
					onDragLeave={this.dragLeave}
					onDrop={this.handleDrop}
			>
				<ListRadio id={list.id} filter={app.filter} setControl={setControl} />
				{list.label}
			</div>
		));
		return (
			<div className="taskmenu appframe">
				<form>
					{statics}
					<hr />
					{lists}
				</form>
			</div>
		);
	}
}

export default TaskMenu;