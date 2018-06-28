class TaskCalendar extends React.Component {
  render() {
    let {tasks, date} = this.props;
    let days = [date];
    for (let i=0; i<6; i++) {
      let day = moment(days[0]);
      days.unshift(day.subtract(1, 'days'));
    }
    let list = tasks[this.props.list].subtasks.map(
      (task, i)=><CalendarRow key={i} task={task} days={days} {...this.props}/>
    );
    console.log(list);
    let headers = days.map((day,i)=><th className="calendar" scope="col" key={i}>{day.format('ddd')+" "+day.format('D')}</th>);
    headers.unshift(
      <th className="calendar" scope="col" key={-1} style={{width: "200px"}}>
        <button title="earlier" style={{float: "left"}}>{"\u2190"}</button>
        <button title="recent" style={{float: "right"}}>{"\u2192"}</button>
      </th>
    );
    return (
      <table>
        <thead>
          <tr>
            {headers}
          </tr>
        </thead>
        <tbody>
          {list}
        </tbody>
      </table>
    );
  }
}

class CalendarRow extends React.Component {
  render() {
    let {task, days, tasks} = this.props;
    let list = days.map((day,i)=><td key={i} className="calendar">xxxx</td>);
    list.unshift(
      <th className="calendar" scope="row" key="-1" style={{width: "200px"}}>
        {tasks[task].label}
        <span style={{float: "right"}}>
          <button>{"?"}</button>
          <button>{"\u2191"}</button>
          <button>{"\u2193"}</button>
          <button>{"\u2717"}</button>
        </span>
      </th>
    );
    return (<tr>{list}</tr>);
  }
}