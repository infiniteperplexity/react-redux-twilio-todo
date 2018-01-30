function TaskList(props) {
	let tasks = props.filtered;
	let listing = props.filtered.map((task, i) => 
		<TaskCard	key={i}
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

class TaskCard extends React.Component {
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
		let id = this.props.id;
		let app = this.props.app;
		return (
			<div	taskid={id}
					draggable="true"
					onDragStart={this.handleDrag}
					onDragOver={this.allowDrop}
					onDrop={this.handleDrop}
					style={{overflow: "hidden"}}
			>
				{this.props.label}
				<span style={{float: "right"}}>
					<TaskButton id={id} onClick={this.props.completeTask} tooltip="complete task">{"\u2713"}</TaskButton>
					<TaskButton id={id} onClick={this.props.showDetails} tooltip="inspect/modify">{"?"}</TaskButton>
					<TaskButton id={id} onClick={x=>setControl("filter",x)} tooltip="show subtasks">{"\u2261"}</TaskButton>			
					<TaskButton id={id} onClick={x=>sortTask(x,app.filter,-1)} tooltip="sort task up">{"\u2191"}</TaskButton>
					<TaskButton id={id} onClick={x=>sortTask(x,app.filter,+1)} tooltip="sort task down">{"\u2193"}</TaskButton>
					<TaskButton id={id} onClick={this.props.deleteTask} tooltip="delete task">{"\u2717"}</TaskButton>
				</span>
			</div>
		);
	}
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
			<TaskToolTip>
				{tooltip}
			</TaskToolTip>
		</button>
	);
}

function TaskToolTip(props) {
	return (
		<span style={{
			position: "absolute",
			visibility: "hidden",
			zIndex: "1",
			width: "120px",
			marginLeft: "-150px",
			backgroundColor: "white"
		}}>
			{props.children}
		</span>
	);
}