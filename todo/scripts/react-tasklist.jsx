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
function TaskCard({app, label, id, showDetails, setControl, completeTask, sortTask, deleteTask}) {
	return (
		<div style={{overflow: "hidden"}}>
			{label}
			<span style={{float: "right"}}>
				<TaskButton id={id} onClick={completeTask} tooltip="complete task">{"\u2713"}</TaskButton>
				<TaskButton id={id} onClick={showDetails} tooltip="inspect/modify">{"?"}</TaskButton>
				<TaskButton id={id} onClick={x=>setControl("filter",x)} tooltip="show subtasks">{"\u2261"}</TaskButton>			
				<TaskButton id={id} onClick={x=>sortTask(x,app.filter,-1)} tooltip="sort task up">{"\u2191"}</TaskButton>
				<TaskButton id={id} onClick={x=>sortTask(x,app.filter,+1)} tooltip="sort task down">{"\u2193"}</TaskButton>
				<TaskButton id={id} onClick={deleteTask} tooltip="delete task">{"\u2717"}</TaskButton>
			</span>
		</div>
	);
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
			<span style={{
				position: "absolute",
				visibility: "hidden",
				zIndex: "1",
				width: "120px",
				marginLeft: "-120px",
				backgroundColor: "white"
			}}>
				{tooltip}
			</span>
		</button>
	);
}