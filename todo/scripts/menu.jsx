
class TaskMenu extends React.Component {
	constructor(props, context) {
		super(props, context);
		this.props.setFilter("$Inbox");
	}
	handleChange = (e) => {
		this.props.setFilter(e.target.value);
	}
	render() {
		let stat = [];
		if (this.props.tasks.$Static) {
			stat = this.props.tasks.$Static.subtasks;
		}
		stat = stat.map((list,i)=>(
			<div key={i}>
				<input	type="radio"
						value={list.id}
						checked={this.props.app.filter===list.id}
						onChange={this.handleChange}
				/>
				{list.label}
			</div>
		));
		let lists = [];
		if (this.props.tasks.$Lists) {
			lists = this.props.tasks.$Lists.subtasks;
		}
		lists = lists.map((list,i)=>(
			<div key={i}>
				<input	type="radio"
						value={list.id}
						checked={this.props.app.filter===list.id}
						onChange={this.handleChange}
				/>
				{list.label}
			</div>
		));
		return (
			<div className="taskmenu appframe">
				<form>
					{stat}
					<hr />
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