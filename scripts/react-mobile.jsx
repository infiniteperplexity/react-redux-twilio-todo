// class MobileMenu extends React.Component {
// 	handleChange = (event)=> {
// 		this.props.setControl("filter",event.target.value);
// 	}
// 	render() {
// 		let tasks = this.props.tasks;
// 		let app = this.props.app;
// 		let setControl = this.props.setControl;
// 		if (!tasks) {
// 			return null;
// 		}
// 		let statics = tasks.$Static.subtasks.map((list,i)=>
// 			<option key={i} value={list.id}>{list.label}</option>
// 		);
// 		let lists = tasks.$Lists.subtasks.map((list,i)=>
// 			<option key={i} value={list.id}>{list.label}</option>
// 		);
// 		return (
// 			<div>
// 				<select value={this.props.app.filter}
//               			onChange={this.handleChange}
//       			>
// 	      			{statics}
// 	      			<option disabled="true">---------------------</option>
// 	      			{lists}
//       			</select>
// 			</div>
// 		);
// 	}
// }

class MobileMenu extends React.Component {
	render() {
		return (
			<div>
				<select>
					<option value="testing">Test static</option>
	      			<option disabled="true">---------------------</option>
	      			<option value="foo">foo</option>
      			</select>
			</div>
		);
	}
}