$(function () {
  $('[data-toggle="tooltip"]').tooltip()
})

class TaskDisplay extends React.Component {
	addTask = (e) => {
		e.preventDefault();
		if (this._label.value!=="") {
			let task = {
				id: uuid.v4(),
				label: this._label.value,
				created: moment().unix(),
				inputs: "check"
			}
			if (this.props.app.filter==="Repeating") {
				task.repeats = "daily";
			}
			this._label.value = "";
			this.props.addTask(task);
		}
	}
	deleteTask = (id) => {
		this.props.deleteTask(id);
	}
	completeTask = (id) => {
		let tasks = {...this.props.tasks};
		let completed = {
			id: uuid.v4(),
			moment: moment().unix(),
			value: true
		}
		let task = {...tasks[id], completed: completed};
		this.props.modifyTask(task);
	}
	sortTaskUp = (id) => {

	}
	sortTaskDown = (id) => {

	}
	viewSubtasks = (id) => {

	}
	inspectTask = (id) => {
		// for now...let's allow changing the label.
		let label, inputs;
		let children =
			<div>
				<input type="text" ref={(e)=>(label=e)} defaultValue={this.props.tasks[id].label} />
				<select ref={(e)=>(inputs=e)} defaultValue={this.props.tasks[id].inputs}>
				    <option value="check">Check</option>
				    <option value="number">Number</option>
				</select>
			</div>
		;
		let modal = {
			children: children,
			submitModal: () => {
				this.props.tasks[id].label = label.value;
				this.props.tasks[id].inputs = inputs.value;
			}
		};
		this.props.showModal(modal);
	}
	render() {
		let filter = this.props.app.filter;
		let tasks = Object.values(this.props.tasks);
		tasks = tasks.filter((task)=>(task.filters[filter]));
		let listing = (filter==="Repeating") ? this.renderCalendar(tasks) : this.renderList(tasks);
		return 	(
			<div className="taskdisplay appframe">
				<form onSubmit={this.addTask}>
				    <input type="text" className="form-control" ref={(e)=>this._label=e} placeholder="Enter Task." />
				    <button type="submit" className="btn">Add Task.</button>
				</form>
				{listing}
			</div>
		);
	}
	handleCalendarElement = (e, task, day) => {
		e.preventDefault();
		task = {...task};
		let occasions = {...(task.occasions || {})};
		let value;
		if (e.target.type==="checkbox") {
			value = e.target.checked;
		} else if (e.target.type==="number") {
			value = e.target.value;
		}
		console.log(value);
		let occasion = {
			id: uuid.v4(),
			value: value,
			moment: day
		};
		occasions[day] = occasion;
		task.occasions = occasions;
		this.props.modifyTask(task);
	}
	renderCalendar = (tasks) => {
		let days = [moment().startOf('day')];
		for (let i=0; i<6; i++) {
			let day = moment(days[0]);
			days.unshift(day.subtract(1,'days'));
		}
		let dayheaders = days.map((day,i) => {
			return (
		 		<th scope="col" key={i}>{day.format('ddd')+" "+day.format('D')}</th>
			);
		});
		days = days.map((day)=>day.unix());
		dayheaders.unshift(<th scope="col" key={-1} />);
		let tasktable = tasks.map((task,i) => {
			let taskdays;
			if (task.inputs==="number") {
		 		taskdays = days.map((day,j) =>
		 			<td key={j}>
			 		 	<input 	type="number"
			 		 			step="any"
			 		 			defaultValue={(task.occasions && task.occasions[day]) ? task.occasions[day].value : null}
			 		 			onChange={(e)=>(this.handleCalendarElement(e,task,day))}
			 		 			style={{width: "60px"}}
			 		 	/>
					</td>
				);
			// } else if (task.inputs==="note") {
			// 	taskdays = days.map((day,j) => (
			// 		<td key={j}>
			// 			<button type="button" className="btn btn-info btn-lg" data-toggle="modal" data-target="#myModal">notes</button>				
			// 		</td>)
			// 	);
			} else if (task.inputs==="check") {
				taskdays = days.map((day,j) => {
					return <td key={j}>
						<input 	type="checkbox"
								checked={(task.occasions && task.occasions[day]) ? task.occasions[day].value==="true" : false}
								onChange={(e)=>(this.handleCalendarElement(e,task,day))}
						/>
					</td>
				});
			}
			return (
				<tr key={i} height="25px">
			 		<th scope="row">
						{task.label}
			 		</th>
				 		{taskdays}
				 </tr>
		 	);
	 	});
		return (
			<div id="#calendar">
				<table className="table table-bordered">
					<thead>
						<tr height="25px">
							{dayheaders}
						</tr>
					</thead>
					<tbody>
						{tasktable}
					</tbody>
				</table>
		 	</div>
		);
	}
	renderList = (tasks) => {
		let items = tasks.map((task,i)=>{
			let buttons = [
				["complete task", this.completeTask, "\u2713"],
				["inspect/modify task", this.inspectTask, "\u2692"],
				["view subtasks as list", this.viewSubtasks, "\u2261"],
				["sort task up", this.sortTaskUp, "\u2191"],
				["sort task down", this.sortTaskDown, "\u2193"],
				["delete task", this.deleteTask, "\u2717\uFE0E"]
			];
			buttons = buttons.map(([tip, func, sym],j)=> (
				<button key={j}
						className="btn"
						style={{float:"right"}}
						onClick={(e)=>{
							e.preventDefault();
							func(task.id);
						}}
						onMouseOver={(e)=>(e.target.querySelector("span").style.visibility="visible")}
						onMouseLeave={(e)=>(e.target.querySelector("span").style.visibility="hidden")}>
					{sym}
					<span style={{
						position: "absolute",
						visibility: "hidden",
						zIndex: "1",
						width: "120px",
						bottom: "50%",
						left: "75%",
						marginLeft: "-20px"
					}}>
						{tip}
					</span>
				</button>
			)).reverse();
			return (
				<div className="card" key={i}>
					<div className="card-header">
						<a className= "card-link" data-toggle = "collapse" data-parent="#accordion" href={"#collapse"+i}>
							{task.label}
							{buttons}
						</a>
					</div>
					<div id={"collapse"+i} className="collapse">
						<div className="card-body">
							<pre>{JSON.stringify(task, null, 2)}</pre>
						</div>
					</div>
				</div>
			)}
		);
		return (
			<div>
			    <div id="accordion">
			        {items}
			    </div>
			    <SharedModalHOC />
			 </div>
		);
	}
}
let TaskDisplayHOC = ReactRedux.connect(
	(state) => ({app: state.app, tasks: state.tasks}),
	(dispatch) => ({
		addTask: (task) => dispatch({type: "MODIFY_DATA", add: [task], delete: [], modify: []}),
		deleteTask: (id) => dispatch({type: "MODIFY_DATA", add: [], delete: [id], modify: []}),
		modifyTask: (task) => dispatch({type: "MODIFY_DATA", add: [], delete: [], modify: [task]}),
		showModal: (modal) => dispatch({type: "SET_MODAL", modal: modal})
	})
)(TaskDisplay);