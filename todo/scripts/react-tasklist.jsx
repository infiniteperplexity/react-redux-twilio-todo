function TaskList(props) {
	let tasks = props.filtered;
	let listing = props.filtered.map((task, i) => 
		<TaskCard	key={i}
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
	console.log(listing[0].props);
	return (
		<div>
			{listing}
		</div>
	);
}

class TaskCard extends React.Component {
	handleDrag = (event) => {
		let json = {taskid: event.target.getAttribute("taskid"), listid: this.props.app.filter};
		event.dataTransfer.setData("text", JSON.stringify(json));
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
		let newtask = tasks[event.target.getAttribute("taskid")];
		if (task===newtask) {
			return;
		}
		this.props.changeList(task, oldlist, newtask);
	}
	render() {
		let task = this.props.tasks[this.props.id];
		let id = this.props.id;
		let app = this.props.app;
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
					draggable="true"
					onDragStart={this.handleDrag}
					onDragOver={this.allowDrop}
					onDragLeave={this.dragLeave}
					onDrop={this.handleDrop}
					style={{
						className: "border border-dark",
						overflow: "hidden",
						backgroundColor: (this.props.n%2===0) ? "#FFFFEE" : "#EEEEFF"
					}}
			>
				{this.props.label}
				{badge}
				<span style={{float: "right"}}>
					<TaskButton id={id} onClick={this.props.completeTask} tooltip="complete task">{"\u2713"}</TaskButton>
					<TaskButton id={id} onClick={this.props.showDetails} tooltip="inspect/modify">{"?"}</TaskButton>
					<TaskButton id={id} onClick={x=>this.props.setControl("filter",x)} tooltip="show subtasks" emphasize={task.subtasks && task.subtasks.length>0}>{"\u2261"}</TaskButton>			
					<TaskButton id={id} onClick={x=>this.props.sortTask(x,app.filter,-1)} tooltip="sort task up">{"\u2191"}</TaskButton>
					<TaskButton id={id} onClick={x=>this.props.sortTask(x,app.filter,+1)} tooltip="sort task down">{"\u2193"}</TaskButton>
					<TaskButton id={id} onClick={this.props.deleteTask} tooltip="delete task">{"\u2717"}</TaskButton>
				</span>
			</div>
		);
	}
}

function TaskButton({id, onClick, tooltip, children, emphasize}) {
	let style = {};
	if (emphasize===true) {
		style.color = "maroon";
		style.fontWeight = "bold";
	};
	return (
		<button className="btn"
				style={style}
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