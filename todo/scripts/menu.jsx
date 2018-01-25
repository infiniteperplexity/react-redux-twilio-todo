
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