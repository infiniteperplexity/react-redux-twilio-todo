class TaskList extends React.Component {
  render() {
    let tasks = this.props.tasks;
    console.log(this.props.list);
    let task = tasks[this.props.list];
    let list = task.subtasks.map((t,i)=><TaskItem key={i} n={i} taskid={t} {...this.props}/>);
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
      this.props.addTasks([this.props.newTask({label: text, lists: [list]})]);
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
    let json = e.dataTransfer.getData("text");
    let {taskid} = JSON.parse(json);
    let {tasks} = this.props;
    let list = clone(tasks[this.props.taskid]);
    if (!list.subtasks.includes(taskid)) {
      list.subtasks.push(taskid);
    }
    let task = tasks[taskid];
    if (!task.lists.includes(list.id)) {
      task.lists.push(list.id); 
    }
    // do I want to remove it from old lists? not yet.
    this.props.modifyTasks([task, list]);
  }
  handleDelete = (e)=>{
    this.props.deleteTasks([this.props.taskid]);
  }
  handleComplete = (e)=>{
    let task = clone(this.props.tasks[this.props.taskid]);
    task.completed = moment().unix();
    this.props.modifyTasks([task]);
  }
  handleDetails = (e)=>{
    this.props.chooseDetails(this.props.taskid);
  }
  handleSubtasks = (e)=>{
    this.props.chooseList(this.props.taskid);
  }
  handleSortUp = (e)=>{
    this.handleSort(-1);
  }
  handleSortDown = (e)=>{
    this.handleSort(+1);
  }
  handleSort = (n)=>{
    let list =  clone(this.props.tasks[this.props.list]);
    let index = list.subtasks.indexOf(this.props.taskid);
    if ((index<=0 && n<0) || (index>=list.length && n>0)) {
      return;
    }
    let swap = list.subtasks[index+n];
    list.subtasks[index+n] = this.props.taskid;
    list.subtasks[index] = swap;
    this.props.modifyTasks([list]);
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
        <button title="complete" onClick={this.handleComplete}>{"\u2713"}</button>
        <button title="details" onClick={this.handleDetails}>{"?"}</button>
        <button title="subtasks" onClick={this.handleSubtasks} style={{
          fontWeight: (tasks[taskid].subtasks && tasks[taskid].subtasks.length>0) ? "bold" : "normal"
        }}>{"\u2261"}</button>
        <button title="sort up" onClick={this.handleSortUp}>{"\u2191"}</button>
        <button title="sort down" onClick={this.handleSortDown}>{"\u2193"}</button>
        <button title="delete" onClick={this.handleDelete}>{"\u2717"}</button>
      </span>
    </li>
  }
}