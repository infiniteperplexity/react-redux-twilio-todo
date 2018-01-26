
class TaskMenu extends React.Component {
	constructor(props, context) {
		super(props, context);
		this.props.setFilter("Inbox");
	}
	handleChange = (e) => {
		this.props.setFilter(e.target.value);
	}
	render() {
		let lists = this.props.lists;
		lists = lists.map((list,i)=>(
			<div key={i}>
				<input	type="radio"
						value={list.label}
						checked={this.props.app.filter===list.label}
						onChange={this.handleChange}
				/>
				{list.label}
			</div>
		));
		return (
			<div className="taskmenu appframe">
				<form>
					{lists}
				</form>
			</div>
		);
	}
}
let TaskMenuHOC = ReactRedux.connect(
	(state) => ({app: state.app, tasks: state.tasks, lists: state.lists}),
	(dispatch) => ({
		setFilter: (filter) => dispatch({type: "SET_FILTER", filter: filter})
	})
)(TaskMenu);