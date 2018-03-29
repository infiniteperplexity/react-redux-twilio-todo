import React from 'react';
import moment from 'moment';
import uuid from 'uuid';
import {TaskButton} from './react-tasklist.jsx';

function TaskCalendar(props) {
	let tasks = props.filtered;
	// here's where we use the current day instead of keeping state
	let days = [moment().startOf('day')];
	for (let i=0; i<6; i++) {
		let day = moment(days[0]);
		days.unshift(day.subtract(1,'days'));
	}
	let listing = props.filtered.map((task, i) => (
		<CalendarRow	key={i}
						task={task}
						days={days}
						{...props}
		/>)
	);
	return (
		<div className="table table-bordered" style={{overflow: "scroll", height: "100vh"}}>
		<table>
			<thead>
				<tr height="25px">
					<CalendarHeader days={days} />
				</tr>
			</thead>
			<tbody>
				{listing}
			</tbody>
		</table>
		</div>
	);
}

function CalendarHeader({days}) {
	let dayheaders = days.map((day,i) => {
		return (
		 	<th scope="col" key={i}>{day.format('ddd')+" "+day.format('D')}</th>
		);
	});
	// let's add buttons here to go forward or back.
	
	let selector = (<th scope="col" key={-1}>
		<button>{"\u2190"}</button>
		<button style={{float: "right"}}>{"\u2192"}</button>
	</th>);
	//dayheaders.unshift(<th scope="col" key={-1} />);
	dayheaders.unshift(selector);
	return dayheaders;
}

function CalendarRow({days, ...props}) {
	let app = props.app;
	let task = props.task;
	let listing = days.map((day, i) =>
		<CalendarDay key={i} day={day.unix()} {...props} />
	);
	return (
		<tr>
			<th scope="row">
				{task.label}
				<span style={{float: "right"}}>
					<TaskButton id={task.id} onClick={props.showDetails} tooltip="inspect/modify">{"?"}</TaskButton>
					<TaskButton id={task.id} onClick={x=>props.sortTask(x,app.filter,-1)} tooltip="sort task up">{"\u2191"}</TaskButton>
					<TaskButton id={task.id} onClick={x=>props.sortTask(x,app.filter,+1)} tooltip="sort task down">{"\u2193"}</TaskButton>
					<TaskButton id={task.id} onClick={props.deleteTask} tooltip="delete task">{"\u2717"}</TaskButton>
				</span>
			</th>
			{listing}
		</tr>
	);
}

function CalendarDay(props) {
	let task = props.task;
	task.occasions = task.occasions || {};
	let occasion = task.occasions[props.day] || {
		id: uuid.v4(),
		value: "",
		moment: props.day
	}
	let input;
	if (task.inputs==="number") {
		input = <CalendarNumberInput occasion={occasion} {...props} />;
	} else if (task.inputs==="check") {
		input = <CalendarCheckboxInput occasion={occasion} {...props} />;
	}
	return <td>{input}</td>;
}

class CalendarCheckboxInput extends React.Component {
	handleChange = (event) => {
		let task = {...this.props.task};
		let occasions = {...task.occasions};
		let occasion = this.props.occasion;
		occasion = {...occasion, value: event.target.checked};
		occasions[this.props.day] = occasion;
		task.occasions = occasions;
		this.props.modifyTask(task);
	}
	render() {
		return (
			<input 	type="checkbox"
					checked={(this.props.occasion.value==="true") ? true : false}
					onChange={this.handleChange}
			/>
		);
	}
}
class CalendarNumberInput extends React.Component {
	handleChange = (event) => {
		let task = {...this.props.task};
		let occasions = {...task.occasions};
		let occasion = this.props.occasion;
		occasion = {...occasion, value: event.target.value};
		occasions[occasion.moment] = occasion;
		task.occasions = occasions;
		this.props.modifyTask(task);
	}
	render() {
		return  (
			<input 	type="number"
					step="any"
					value={this.props.occasion.value || ""}
					onChange={this.handleChange}
					style={{width: "60px"}}
			/>
		);
	}
}

export default TaskCalendar;