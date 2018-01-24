// $(document).ready(function(){
//     $('[data-toggle="popover"]').popover();
// });


class App extends React.Component {
	// this is where task addition and modification should go.
	render() {
		return (
			<div>
				<div className="taskapp">
					<TaskMenuHOC />
					<TaskDisplayHOC />
				</div>
				<SharedModalHOC />
			</div>
		);
	}
}

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
		let occasion = {
			id: uuid.v4(),
			value: e.target.checked,
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
			 			<input	type="number" 
								step="any"
								style={{width: "50px"}}
								onChange={()=>(this.handleCalendarElement(e,task,day))}
						/>
					</td>
				);
			} else if (task.inputs==="note") {
				taskdays = days.map((day,j) => (
					<td key={j}>
						<button type="button" className="btn btn-info btn-lg" data-toggle="modal" data-target="#myModal">notes</button>				
					</td>)
				);
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
		let items = tasks.map((task,i)=>(
			<div className="card" key={i}>
				<div className="card-header">
					<a className= "card-link" data-toggle = "collapse" data-parent="#accordion" href={"#collapse"+i}>
						{task.label}
						<button style={{float:"right"}} className="btn" onClick={(e)=>{
							e.preventDefault();
							this.deleteTask(task.id);
						}}>{"\u2717\uFE0E"}</button>
						<button style={{float:"right"}} className="btn" onClick={(e)=>{
							e.preventDefault();
							this.completeTask(task.id);
						}}>{"\u2713"}</button>
					</a>
				</div>
				<div id={"collapse"+i} className="collapse">
					<div className="card-body">
						<pre>{JSON.stringify(task, null, 2)}</pre>
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
	(state) => ({app: state.app, tasks: state.tasks}),
	(dispatch) => ({
		addTask: (task) => dispatch({type: "MODIFY_DATA", add: [task], delete: [], modify: []}),
		deleteTask: (id) => dispatch({type: "MODIFY_DATA", add: [], delete: [id], modify: []}),
		modifyTask: (task) => dispatch({type: "MODIFY_DATA", add: [], delete: [], modify: [task]})
	})
)(TaskDisplay);



class TaskMenu extends React.Component {
	constructor(props, context) {
		super(props, context);
		this.props.setFilter("Inbox");
	}
	handleChange = (e) => {
		this.props.setFilter(e.target.value);
	}
	render() {
		return (
			<div className="taskmenu appframe">
				<form>
					<input 	type="radio"
							value="Inbox"
							checked={this.props.app.filter==="Inbox"}
							onChange={this.handleChange}
					/>
					Inbox
					<br />
					<input 	type="radio"
							value="Repeating"
							checked={this.props.app.filter==="Repeating"}
							onChange={this.handleChange}
					/>Repeating
					<br />
					<input 	type="radio"
							value="Completed"
							checked={this.props.app.filter==="Completed"}
							onChange={this.handleChange}
					/>Completed
					<br />
					<input 	type="radio"
							value="All"
							checked={this.props.app.filter==="All"}
							onChange={this.handleChange}
					/>All
				</form>
			</div>
		);
	}
}

let TaskMenuHOC = ReactRedux.connect(
	(state) => ({app: state.app, tasks: state.tasks}),
	(dispatch) => ({
		setFilter: (filter) => dispatch({type: "SET_FILTER", filter: filter})
	})
)(TaskMenu);

class SharedModal extends React.Component {
	render() {
		return (<div className="modal fade" id="myModal" hidden="true" tabindex="-1" ></div>)
	}
}

let SharedModalHOC = ReactRedux.connect(
	(state) => ({app: state.app, task: state.tasks}),
	(dispatch) => ({})
)(SharedModal);


let destination = document.querySelector("#container");
ReactDOM.render(
	<ReactRedux.Provider store={store}>
		<App />
	</ReactRedux.Provider>,
	destination
);

/*

<button type="button" class="btn btn-primary" data-toggle="modal" data-target="#exampleModal" data-whatever="@mdo">Open modal for @mdo</button>
<button type="button" class="btn btn-primary" data-toggle="modal" data-target="#exampleModal" data-whatever="@fat">Open modal for @fat</button>
<button type="button" class="btn btn-primary" data-toggle="modal" data-target="#exampleModal" data-whatever="@getbootstrap">Open modal for @getbootstrap</button>

<div class="modal fade" id="exampleModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
  <div class="modal-dialog" role="document">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="exampleModalLabel">New message</h5>
        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div class="modal-body">
        <form>
          <div class="form-group">
            <label for="recipient-name" class="form-control-label">Recipient:</label>
            <input type="text" class="form-control" id="recipient-name">
          </div>
          <div class="form-group">
            <label for="message-text" class="form-control-label">Message:</label>
            <textarea class="form-control" id="message-text"></textarea>
          </div>
        </form>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
        <button type="button" class="btn btn-primary">Send message</button>
      </div>
    </div>
  </div>
</div>

$('#exampleModal').on('show.bs.modal', function (event) {
  var button = $(event.relatedTarget) // Button that triggered the modal
  var recipient = button.data('whatever') // Extract info from data-* attributes
  // If necessary, you could initiate an AJAX request here (and then do the updating in a callback).
  // Update the modal's content. We'll use jQuery here, but you could use a data binding library or other methods instead.
  var modal = $(this)
  modal.find('.modal-title').text('New message to ' + recipient)
  modal.find('.modal-body input').val(recipient)
})
*/


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