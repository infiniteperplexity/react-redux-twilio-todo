$(function () {
  $('[data-toggle="tooltip"]').tooltip()
});

function App(props) {
	let words = "Goodbye world";
	return <p>{words}</p>;
}
window.onpopstate = function(event) {
   	if (event.state) {
  		store.dispatch({type: "SET_CONTROL", control: "filter", value: event.state.filter});
  	}
};
window.history.replaceState({filter: "$Inbox"},"title", window.location);
let destination = document.querySelector("#container");
ReactDOM.render(
	<App />,
	destination
);