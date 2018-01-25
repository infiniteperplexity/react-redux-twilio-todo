// $(document).ready(function(){
//     $('[data-toggle="popover"]').popover();
// });
$(function () {
  $('[data-toggle="tooltip"]').tooltip()
})
class App extends React.Component {
	// this is where task addition and modification should go.
	render() {
		return (
			<div>
				<div className="taskapp">
					<TaskMenuHOC />
					<TaskDisplayHOC />
				</div>
			</div>
		);
	}
}


let destination = document.querySelector("#container");
ReactDOM.render(
	<ReactRedux.Provider store={store}>
		<App />
	</ReactRedux.Provider>,
	destination
);

/*

<button type="button" className="btn btn-primary" data-toggle="modal" data-target="#exampleModal" data-whatever="@mdo">Open modal for @mdo</button>
<button type="button" className="btn btn-primary" data-toggle="modal" data-target="#exampleModal" data-whatever="@fat">Open modal for @fat</button>
<button type="button" className="btn btn-primary" data-toggle="modal" data-target="#exampleModal" data-whatever="@getbootstrap">Open modal for @getbootstrap</button>

<div className="modal fade" id="exampleModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
  
</div>


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
  // <button type="button" className="btn btn-primary dropdown-toggle" data-toggle="dropdown">
  //   Dropdown button
  // </button>
  // <div className="dropdown-menu">
  // <div className="dropdown-header">Dropdown header 1</div> 
  //   <a className="dropdown-item" href="#">Link 1<

//  <div className="dropdown-divider"></div> 
// .badge can go inside elements
// <ul className="pagination">
//  <li className="page-item"><a className="page-link" href="#">
// <ul className="breadcrumb">
//  <li className="breadcrumb-item"><a href="#">Photos</a></li>
// <ul className="list-group">
//  <li className="list-group-item .list-group-item-action active">Active item</li>
// <div className="card">
//  <div className="card-header">Header</div>
//  <div className="card-body">Content</div>
//  <div className="card-footer">Footer</div>
// </div>
// collapse looks pretty cool
//<a className="card-link" data-toggle="collapse" data-parent="#accordion" href="#collapseOne">
// not totally clear on how .nav-tabs work
// I Think the data-toggle="tab" and .tab-pane system is what I want.
// .navbar may or may not be useful
// form-group and form-control
// modals are pop-ups and have a bunch of classes
// <button type="button" className="btn btn-primary" data-toggle="modal" data-target="#myModal">
//   Open modal
// </button>

// <!-- The Modal -->
// <div className="modal fade" id="myModal">
//   <div className="modal-dialog">
//     <div className="modal-content">

//       <!-- Modal Header -->
//       <div className="modal-header">
//         <h4 className="modal-title">Modal Heading</h4>
//         <button type="button" className="close" data-dismiss="modal">&times;</button>
//       </div>

//       <!-- Modal body -->
//       <div className="modal-body">
//         Modal body..
//       </div>

//       <!-- Modal footer -->
//       <div className="modal-footer">
//         <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
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