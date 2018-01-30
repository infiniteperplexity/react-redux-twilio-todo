function ListRadio({filter, id, setControl}) {
	return (
		<input	type="radio"
				value={id}
				checked={filter===id}
				onChange={e=>setControl("filter",e.target.value)}
		/>
	);
}


function TaskMenu({tasks, app, setControl}) {
	if (!tasks) {
		return null;
	}
	let statics = tasks.$Static.subtasks.map((list,i)=>(
		<div key={i}>
			<ListRadio id={list.id} filter={app.filter} setControl={setControl} />
			{list.label}
		</div>
	));
	let lists = tasks.$Lists.subtasks.map((list,i)=>(
		<div key={i}>
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