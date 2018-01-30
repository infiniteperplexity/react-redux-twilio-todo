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
		event.dataTransfer.setData("text", event.target.getAttribute("taskid"));
	}
	allowDrop = (event) => {
		event.preventDefault();
	}
	handleDrop = (event) => {
		event.preventDefault();
		let id = event.dataTransfer.getData("text");
		let tasks = this.props.tasks;
		let task1 = tasks[id];
		let task2 = tasks[event.target.getAttribute("taskid")];
		console.log("Dragged "+task1.label+" onto "+task2.label+".");
	}
	render() {
		let tasks = this.props.tasks;
		let app = this.props.app;
		let setControl = this.props.setControl;
		if (!tasks) {
			return null;
		}
		let statics = tasks.$Static.subtasks.map((list,i)=>(
			<div	key={i}
					taskid={list.id}
					draggable="true"
					onDragStart={this.handleDrag}
					onDragOver={this.allowDrop}
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