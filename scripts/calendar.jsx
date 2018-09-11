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
      (task, i)=><CalendarRow key={i} n={i} task={task} days={days} {...this.props}/>
    );
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
  handleDetails = ()=>{
    this.props.chooseDetails(this.props.task);
  }
  handleSort = (n)=> {
    let list =  clone(this.props.tasks[this.props.list]);
    let index = list.subtasks.indexOf(this.props.task);
    if ((index<=0 && n<0) || (index>=list.length && n>0)) {
      return;
    }
    let swap = list.subtasks[index+n];
    list.subtasks[index+n] = this.props.task;
    list.subtasks[index] = swap;
    this.props.modifyTasks([list]);
  }
  handleSortUp = ()=> {
    this.handleSort(-1);
  }
  handleSortDown = ()=> {
    this.handleSort(+1);
  }
  handleDelete = ()=> {
    this.props.deleteTasks([this.props.task]);
  }
  render() {
    // <input type="checkbox" />
    let {task, days, tasks, n} = this.props;
    let list = days.map((day,i)=><td key={i} style={{
      width: COLWIDTH,
      height: COLHEIGHT
    }} className="calendar">
      <DayInput day={day} {...this.props}/>
    </td>);
    list.unshift(
      <th className="calendar" scope="row" key="-1" style={{width: ROWHEAD}}>
        {tasks[task].label}
        <span style={{float: "right"}}>
          <button onClick={this.handleDetails}>{"?"}</button>
          <button onClick={this.handleSortUp} style={{
            color: (n>0) ? "black" : "gray"
          }}>{"\u2191"}</button>
          <button onClick={this.handleSortDown} style={{
            color: (n<tasks[this.props.list].subtasks.length-1) ? "black" : "gray"
          }}>{"\u2193"}</button>
          <button onClick={this.handleDelete} style={{
            color: (tasks[task].static) ? "gray" : "black"
          }}>{"\u2717"}</button>
        </span>
      </th>
    );
    return (<tr>{list}</tr>);
  }
}

class DayInput extends React.Component {
  onChange=(e)=>{
    let task = this.props.tasks[this.props.task];
    task = clone(task);
    let day = this.props.day.unix();
    if (!task.occasions) {
      task.occasions = {};
    }
    task.occasions[day] = parseFloat(e.target.value);
    this.props.modifyTasks([task]);
  }
  render() {
    let task = this.props.tasks[this.props.task];
    let day = this.props.day.unix();
    if (!task.occasions) {
      task.occasions = {};
    }
    let val = (task.occasions[day]===undefined) ? "" : task.occasions[day];
    return <input
      type="number"
      value={val}
      onChange={this.onChange}
      style={{width: "50px"}}
    />;
  }
}