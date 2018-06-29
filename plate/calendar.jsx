const ROWHEAD = "200px";
const COLWIDTH = "100px";
const COLHEIGHT = "100px";

class TaskCalendar extends React.Component {
  addDay = (e) => {
    this.props.chooseDate(this.props.date.add(1,'days'));
  }
  subtractDay = (e) => {
    this.props.chooseDate(this.props.date.subtract(1,'days'));
  }
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
    let headers = days.map((day,i)=><th className="calendar" scope="col" key={i} style={{width: COLWIDTH}}>{day.format('ddd')+" "+day.format('D')}</th>);
    headers.unshift(
      <th className="calendar" scope="col" key={-1} style={{width: ROWHEAD}}>
        <button title="earlier" onClick={this.subtractDay} style={{float: "left"}}>{"\u2190"}</button>
        <button title="recent" onClick={this.addDay} style={{float: "right"}}>{"\u2192"}</button>
      </th>
    );
    return (
      <div>
        <TaskToolbar {...this.props}/>
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
      </div>
    );
  }
}

class CalendarRow extends React.Component {
  render() {
    let {task, days, tasks} = this.props;
    let list = days.map((day,i)=><td key={i} style={{
      width: COLWIDTH,
      height: COLHEIGHT
    }} className="calendar"> </td>);
    list.unshift(
      <th className="calendar" scope="row" key="-1" style={{width: ROWHEAD}}>
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