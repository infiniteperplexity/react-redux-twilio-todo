class App extends React.Component {
	render() {
		return (
			<div className="taskapp">
				<TaskMenuHOC />
				<TaskDisplayHOC />
				<TaskDetailsHOC />
			</div>
		);
	}
}

class TaskDisplay extends React.Component {
	addTask = (e) => {
		e.preventDefault();
		let label = this._label.value;
		if (label!=="") {
			let task = uuid.v4();
			let triples = [
				[task,"a",":Task"],
				[task,":created",Date()],
				[task,"rdfs:label",label]
			];
			this._label.value = "";
			this.props.addTriples(triples);
		}
	}
	deleteTask = (id) => {
		this.props.deleteTasks([id]);
	}
	completeTask = (id) => {
		this.props.completeTasks([id]);
	}
	selectTask = (id) => {
		this.props.selectTask(id);
	}
	render() {
		// this system works pretty well
		let tasks = this.props.tasks;
		for (let filter of this.props.filters) {
			tasks = tasks.filter(filter.bind(this));
		}
		let labels = this.props.labels;
		let items = tasks.map((taskid,i)=>(
			<div className="card" key={i}>
				<div className="card-header">
					<a className= "card-link" data-toggle = "collapse" data-parent="#accordion" href={"#collapse"+i}>
						{labels[taskid]}
						<button style={{float:"right"}} className="btn" onClick={()=>this.deleteTask(taskid)}>{"\u2717\uFE0E"}</button>
						<button style={{float:"right"}} className="btn" onClick={()=>this.completeTask(taskid)}>{"\u2713"}</button>
					</a>
				</div>
				<div id={"collapse"+i} className="collapse">
					<div className="card-body">
						{taskid}<br />
						some more text here
					</div>
				</div>
			</div>
			)
		);
		return (
			<div className="taskdisplay appframe">
				<form onSubmit={this.addTask}>
		        <input type="text" className="form-control" ref={(e)=>this._label=e} placeholder="Enter Task." />
		        <button type="submit" className="btn">Add Task.</button>
		        	<div id="accordion">
		        		{items}
		        	</div>
		        </form>
			</div>
		);
	}
}

let TaskDisplayHOC = ReactRedux.connect(
	(state) => ({	tasks: state.tasks,
					labels: state.labels,
					filters: state.filters,
					completed: state.completed
				}),
	(dispatch) => ({
		addTriples: (triples) => dispatch({type: "ADD_TRIPLES", triples: triples}),
		deleteTasks: (ids) => dispatch({type: "DELETE_IDS", ids: ids}),
		completeTasks: (ids) => dispatch({type: "COMPLETE_IDS", ids: ids}),
		selectTask: (id) => dispatch({type: "SELECT_TASK", id: id})
	})
)(TaskDisplay);



class TaskMenu extends React.Component {
	constructor(props, context) {
		super(props, context);
		this.props.setFilters([this.filterIncomplete]);
	}
	filterComplete(task) {
		return (task in this.props.completed);
	}
	filterIncomplete(task) {
		return (!(task in this.props.completed));
	}
	handleChange = (e) => {
		switch(e.target.value) {
			case "incomplete":
				this.props.setFilters([this.filterIncomplete]);
				return;
			case "complete":
				this.props.setFilters([this.filterComplete]);
				return;
			default:
				return;
		}
	}
	render() {
		return (
			<div className="taskmenu appframe">
				<form>
					<input 	type="radio"
							value="incomplete"
							checked={this.props.filters.indexOf(this.filterIncomplete)!==-1}
							onChange={this.handleChange}
					/>To-Do<br />
					<input 	type="radio"
							value="complete"
							checked={this.props.filters.indexOf(this.filterComplete)!==-1}
							onChange={this.handleChange}
					/>Complete
				</form>
			</div>
		);
	}
}

let TaskMenuHOC = ReactRedux.connect(
	(state) => ({filters: state.filters}),
	(dispatch) => ({
		setFilters: (filters) => dispatch({type: "SET_FILTERS", filters: filters})
	})
)(TaskMenu);

class TaskDetails extends React.Component {
	render() {
		let task = this.props.selected;
		if (!task) {
			return (<div className="taskdetails appframe" />);
		}
		return ( 
			<div className="taskdetails appframe">
				<div>{task.label}</div>
				<div>{"ID: "+task.id}</div>
				<div>{"Created: "+task.created}</div>
				<div>{"Completed: "+((task.completed) ? task.completed : "N/A")}</div>
			</div>
		);
	}
}

let TaskDetailsHOC = ReactRedux.connect(
	(state) => ({selected: state.selected, tasks: state.tasks}),
	(dispatch) => ({})
)(TaskDetails);

let destination = document.querySelector("#container");
ReactDOM.render(
	<ReactRedux.Provider store={store}>
		<App />
	</ReactRedux.Provider>,
	destination
);



// <mark> element to highlight text
// <dl><dt><dd> is like dict; name-value pairs.
// colors...
	// - muted
	// - primary
	// - success
	// - info
	// - warning
	// - danger
	// - secondary
	// - dark
	// - light
	// - white
// table-, text-, bg-
// .table-bordered, table-hover for table
// also .thead, .table-responsive, with -sizes
// .jumbotron for great big bold headers

// .alert .alert-success .alert-dismissablef fade show
// .btn for buttons
  // <button type="button" class="btn btn-primary dropdown-toggle" data-toggle="dropdown">
  //   Dropdown button
  // </button>
  // <div class="dropdown-menu">
  // <div class="dropdown-header">Dropdown header 1</div> 
  //   <a class="dropdown-item" href="#">Link 1<

//  <div class="dropdown-divider"></div> 
// .badge can go inside elements
// <ul class="pagination">
//  <li class="page-item"><a class="page-link" href="#">
// <ul class="breadcrumb">
//  <li class="breadcrumb-item"><a href="#">Photos</a></li>
// <ul class="list-group">
//  <li class="list-group-item .list-group-item-action active">Active item</li>
// <div class="card">
//  <div class="card-header">Header</div>
//  <div class="card-body">Content</div>
//  <div class="card-footer">Footer</div>
// </div>
// collapse looks pretty cool
//<a class="card-link" data-toggle="collapse" data-parent="#accordion" href="#collapseOne">
// not totally clear on how .nav-tabs work
// I Think the data-toggle="tab" and .tab-pane system is what I want.
// .navbar may or may not be useful
// form-group and form-control
// modals are pop-ups and have a bunch of classes
// <button type="button" class="btn btn-primary" data-toggle="modal" data-target="#myModal">
//   Open modal
// </button>

// <!-- The Modal -->
// <div class="modal fade" id="myModal">
//   <div class="modal-dialog">
//     <div class="modal-content">

//       <!-- Modal Header -->
//       <div class="modal-header">
//         <h4 class="modal-title">Modal Heading</h4>
//         <button type="button" class="close" data-dismiss="modal">&times;</button>
//       </div>

//       <!-- Modal body -->
//       <div class="modal-body">
//         Modal body..
//       </div>

//       <!-- Modal footer -->
//       <div class="modal-footer">
//         <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
//       </div>
// tooltips are a no-brainer


// so...one possible layout is that *everything* is a task.
// that would include lists, and there are even some default things...
//...the "root" task, for example, and the "front-page" task.
// alright, so in Remember The Milk, Smart Lists are based off search results.
// search results use RTM's own "search language"


// come up with a system for building and navigating lists
// come up with a system for dailies.
// come up with some sort of sorting mechanism...note that you can use ORDER BY when pulling from SQL...but not when inserting
// split my test account from my user account
// really learn the bootstrap stuff well and maybe fork my own versions
// so you can always handle list membership using tags and filters