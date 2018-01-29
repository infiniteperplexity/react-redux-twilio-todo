function ListRadio({filter, id, handleChange}) {
	return (
		<input	type="radio"
				value={id}
				checked={filter===id}
				onChange={e=>handleChange("filter",e.target.value)}
		/>
	);
}


function TaskMenu({tasks, app, handleChange}) {
	if (!tasks) {
		return null;
	}
	let statics = tasks.$Static.subtasks.map((list,i)=>(
		<div key={i}>
			<ListRadio id={list.id} filter={app.filter} handleChange={handleChange} />
			{list.label}
		</div>
	));
	let lists = tasks.$Lists.subtasks.map((list,i)=>(
		<div key={i}>
			<ListRadio id={list.id} filter={app.filter} handleChange={handleChange} />
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