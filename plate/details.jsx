class TaskDetails extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      task: clone(this.props.tasks[this.props.details])
    };
  }
  handleSubmit = (e)=>{
    let task = this.state.task;
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
    let lists = task.lists.map((t,i)=><li key={i}>{tasks[t].label}</li>);
    let subtasks = task.subtasks.map((t,i)=><li onClick={this.handleDetails(t)} key={i}>{tasks[t].label}</li>);
    return (
      <div>
        <p>ID: {task.id}</p>
        <div>
          Label: <input type="text" ref={e=>this._label=e} defaultValue={task.label}/>
        </div>
        <div>On Lists:</div>
        <ul>{lists}</ul>
        <div>Created: {task.created}</div>
        <div>Touched: {task.touched}</div>
        <div>Notes:</div>
        <textarea rows="25" cols="50" ref={e=>this._notes=e} defaultValue={task.notes}/>
        <div>Subtasks:</div>
        <ol>{subtasks}</ol>
        <div>
          <button onClick={this.handleSubmit}>Submit</button>
          <button onClick={this.handleCancel}>Cancel</button>
        </div>
        <div>Debug: {JSON.stringify(this.props.tasks[this.props.details])}</div>
      </div>
    );
  }
}