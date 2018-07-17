class TaskDetails extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      task: clone(this.props.tasks[this.props.details])
    };
  }
  handleSubmit = (e)=>{
    let task = this.state.task;
    if (task.static) {
      return;
    }
    task.label = this._label.value;
    task.notes = this._notes.value;
    this.props.modifyTasks([task]);
    this.props.chooseDetails(null);
  }
  handleCancel = (e)=>{
    this.props.chooseDetails(null);
  }
  handleDetails = (id)=>{
    // should this discard or submit current changes??
    return (e)=>{
      this.setState({
        task: clone(this.props.tasks[id])
      });
      this.props.chooseDetails(id)
    };
  }
  render() {
    let task = this.state.task;
    let tasks = this.props.tasks;
    let lists = [];
    for (let id in tasks) {
      if (tasks[id].subtasks && tasks[id].subtasks.includes(task.id)) {
        lists.push(tasks[id]);
      }
    }
    lists = lists.map((t,i)=><li key={i}>{t.label}</li>);
    let subtasks = task.subtasks.map((t,i)=><li onClick={this.handleDetails(t)} key={i}>{tasks[t].label}</li>);
    let dailies = null;
    // not sure if this is always how I will do it
    if (task.summaries) {
      dailies = (
        <div>
          <div>Weekly Total: {task.summaries.weeklyTotal}</div>   
          <div>Weekly Average: {(task.summaries.weeklyTotal/task.summaries.weeklyDays).toFixed(2)}</div>
        </div>
      );
    }
    return (
      <div>
        <p>ID: {task.id}</p>
        <div>
          Label: <input type="text" ref={e=>this._label=e} defaultValue={task.label} style={{
            color: (task.static) ? "gray" : "black"
          }}/>
        </div>
        <div>Subtask of:</div>
        <ul>{lists}</ul>
        <div>Created: {task.created || "N/A"}</div>
        <div>Touched: {task.touched || task.created || "N/A"}</div>
        <div>Notes:</div>
        <textarea rows="25" cols="50" ref={e=>this._notes=e} defaultValue={task.notes.replace()} style={{
            color: (task.static) ? "gray" : "black"
          }}/>
        {dailies}
        <div>Subtasks:</div>
        <ol>{subtasks}</ol>
        <div>
          <button onClick={this.handleSubmit} style={{
            color: (task.static) ? "gray" : "black"
          }}>Submit</button>
          <button onClick={this.handleCancel}>Cancel</button>
        </div>
        <div>Debug: {JSON.stringify(this.props.tasks[this.props.details])}</div>
      </div>
    );
  }
}
