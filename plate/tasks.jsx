class TaskMenu extends React.Component {
  render() {
    let statics = [
      "$Inbox",
      "$Calendar",
      "$Complete",
      "$Tasks",
      "$Lists"
    ];
    let tasks = this.props.tasks;
    let list = statics.map((e,i)=><div key={i}>
      <input type="radio"/>
      {tasks[e].label}
    </div>);
    return list;
  }
}

class TaskList extends React.Component {
  render() {
    let tasks = this.props.tasks;
    let task = tasks.$Tasks;
    let list = task.subtasks.map((e,i)=><div key={i}>{e.label}</div>);
    list.unshift(
      <div key="-1">
        <input type="text" size="50"/>
        <br />
        <button>Add task</button>
      </div>
    );
    return (<div>
      {list}
    </div>);
  }
}