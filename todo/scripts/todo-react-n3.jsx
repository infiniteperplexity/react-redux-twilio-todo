// $(document).ready(function(){
//     $('[data-toggle="popover"]').popover();
// });


class App extends React.Component {
	render() {
		return (
			<div className="taskapp">
				<TaskMenuHOC />
				<TaskDisplayHOC />
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
			if (this.props.filter==="repeating") {
				triples.push([task,":repeats","daily"]);
				triples.push([task,":inputs","check"]);
			}
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
		let tasks = this.props.tasks;
		let filter = this.props.filters[this.props.filter];
		tasks = tasks.filter(filter.bind(this));
		let listing = (this.props.filter==="repeating") ? this.renderCalendar(tasks) : this.renderList(tasks);
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
	handleCalendarElement = (e,task,day) => {
		let {value, type} = e.target;
		let completions = this.props.completed[task] || [];
		// need to assume this is an array for this kind of task
		for (let completion of completions) {
			if (day.isSame(completion,'day')) {
				// delete that completion
				// or maybe filter this...shouldn't mutate state.
			}
		}
		// except this is wrong, since it can't handle other completion statuses.
		this.props.addTriples([[task, ":completed", day.format("YYYY-MM-DD")]]);
		// maybe...or just reuse the old one?  yeah.
		let status = uuid.v4();
		// this.props.addTriples([
		// 	[task, ":status", status],
		// 	[status, "rdfs:value", value],
		// 	[status, ":updated", day.format("YYYY-MM-DD")]
		// ]);
	}
	renderCalendar = (tasks) => {
		let labels = this.props.labels;
		let inputs = this.props.inputs;
		// we need to pull old completions
		let days = [moment()];
		for (let i=0; i<6; i++) {
			let day = moment(days[0]);
			days.unshift(day.subtract(1,'days'));
		}
		let dayheaders = days.map((day,i) => {
			return (
				<th scope="col" key={i}>{day.format('ddd')+" "+day.format('D')}</th>
			);
		});
		dayheaders.unshift(<th scope="col" key={-1} />);
		let tasktable = tasks.map((task,i) => {
			let taskdays;
			if (inputs[task]==="number") {
				taskdays = days.map((day,j) =>
					<td key={j}>
						<input 	type="number" 
								step="any"
								style={{width: "50px"}}
								onChange={()=>(this.handleCalendarElement(e,task,day))}
						/>
					</td>
				);
			} else if (inputs[task]==="note") {
				taskdays = days.map((day,j) => (
					<td key={j}>
						<button type="button" className="btn btn-info btn-lg" data-toggle="modal" data-target="#myModal">notes</button>				
					</td>)
				);
			} else { //if (inputs[task]==="check") {
				taskdays = days.map((day,j) =>
					<td key={j}>
						<input 	type="checkbox"
								onChange={(e)=>(this.handleCalendarElement(e,task,day))}
					/>
					</td>
				);
			}
			return (
			<tr key={i} height="25px">
				<th scope="row">
					{labels[task]}
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
				<div className="modal fade" id="myModal" role="dialog">
    				<div className="modal-dialog">
      					<div className="modal-content">
        					<div className="modal-body">
          						<textarea cols="48" rows="10" defaultValue="notes." />
        					</div>
        					<div className="modal-footer">
          						<button type="button" className="btn btn-default" data-dismiss="modal">Close</button>
        					</div>
      					</div>
    				</div>
  				</div>
			</div>
		);
	}
	renderList = (tasks) => {
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
		    <div id="accordion">
		        {items}
		    </div>
		);
	}
}

let TaskDisplayHOC = ReactRedux.connect(
	(state) => ({	tasks: state.tasks,
					labels: state.labels,
					inputs: state.inputs,
					filters: state.filters,
					filter: state.filter,
					completed: state.completed,
					repeating: state.repeating
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
		this.props.setFilter("inbox");
	}
	handleChange = (e) => {
		this.props.setFilter(e.target.value);
	}
	render() {
		return (
			<div className="taskmenu appframe">
				<form>
					<input 	type="radio"
							value="inbox"
							checked={this.props.filter==="inbox"}
							onChange={this.handleChange}
					/>
					Inbox
					<br />
					<input 	type="radio"
							value="repeating"
							checked={this.props.filter==="repeating"}
							onChange={this.handleChange}
					/>Repeating
					<br />
					<input 	type="radio"
							value="complete"
							checked={this.props.filter==="complete"}
							onChange={this.handleChange}
					/>Complete
					<br />
					<input 	type="radio"
							value="all"
							checked={this.props.filter==="all"}
							onChange={this.handleChange}
					/>All
				</form>
			</div>
		);
	}
}

let TaskMenuHOC = ReactRedux.connect(
	(state) => ({filters: state.filters, filter: state.filter}),
	(dispatch) => ({
		setFilter: (filter) => dispatch({type: "SET_FILTER", filter: filter})
	})
)(TaskMenu);

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