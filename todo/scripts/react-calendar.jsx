function TaskCalendar(props) {
	let tasks = props.filtered;
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
		<table className="table table-bordered">
			<thead>
				<tr height="25px">
					<CalendarHeader days={days} />
				</tr>
			</thead>
			<tbody>
				{listing}
			</tbody>
		</table>
	);
}

function CalendarHeader({days}) {
	let dayheaders = days.map((day,i) => {
		return (
		 	<th scope="col" key={i}>{day.format('ddd')+" "+day.format('D')}</th>
		);
	});
	dayheaders.unshift(<th scope="col" key={-1} />);
	return dayheaders;
}

function CalendarRow({days, ...props}) {
	let listing = days.map((day, i) =>
		<CalendarDay key={i} day={day.unix()} {...props} />
	);
	return (
		<tr>
			<th scope="row">
				{props.task.label}
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
		console.log(this.props.occasion.value);
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
		occasions[occasion.day] = occasion;
		task.occasions = occasions;
		this.props.modifyTask(task);
	}
	render() {
		return  (
			<input 	type="number"
					step="any"
					value={this.props.occasion.value || null}
					onChange={this.handleChange}
					style={{width: "60px"}}
			/>
		);
	}
}