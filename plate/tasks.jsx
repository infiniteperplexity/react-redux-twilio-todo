class TaskList extends React.Component {
  render() {
    let tasks = this.props.tasks;
    let task = tasks[this.props.list];
    let list = task.subtasks.map((t,i)=><TaskItem key={i} n={i} taskid={t} tasks={tasks}/>);
    return (
      <div>
        <TaskToolbar {...this.props}/>
        <ol style={{listStyleType: "none", padding: "5px", margin: "0"}}>
          {list}
        </ol>
      </div>
    );
  }
}

class TaskToolbar extends React.Component {
  handleAdd = (e)=>{
    let text = this._textInput.value;
    if (text) {
      let list = this.props.list;
      let task = this.props.tasks[list];
      this.props.addTask(this.props.newTask({label: text, lists: [list]}));
      this._textInput.value = "";
    }
  }
  render() {
    return (
      <div>
        <input ref={e=>this._textInput=e} type="text" style={{width: "40%"}}/>
        <br/>
        <button onClick={this.handleAdd}>Add task</button>
      </div>
    );
  }
}
class TaskItem extends React.Component {
  handleDrag = (e)=>{
    let json = {taskid: this.props.taskid};
    e.dataTransfer.setData("text", JSON.stringify(json));
  }
  allowDrop = (e)=>{
    e.preventDefault();
    e.target.style.fontWeight = "bold";
  }
  handleLeave = (e)=>{
    e.preventDefault();
    e.target.style.fontWeight = "normal";
  }
  handleDrop = (e)=>{
    e.preventDefault();
    e.target.style.fontWeight = "normal";
  }
  render() {
    let {taskid, tasks, n} = this.props;
    // emphasize subtasks when there are some
    return <li 
      style={{ 
        height: "30px",
        paddingLeft: "5px",
        backgroundColor: (n%2)===0 ? "#ffffee" : "#eeeeff"
      }}
      draggable="true"
      onDragStart={this.handleDrag}
      onDragLeave={this.handleLeave}
      onDragOver={this.allowDrop}
      onDrop={this.handleDrop}
    >
      <span>
        <span style={{display: "inline-block", paddingTop: "5px"}}>{tasks[taskid].label}</span>
      </span>
      <span style={{float: "right"}}>
        <button title="complete">{"\u2713"}</button>
        <button title="details">{"?"}</button>
        <button title="subtasks">{"\u2261"}</button>
        <button title="sort up">{"\u2191"}</button>
        <button title="sort down">{"\u2193"}</button>
        <button title="delete">{"\u2717"}</button>
      </span>
    </li>
  }
}