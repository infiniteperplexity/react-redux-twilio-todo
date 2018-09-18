class TaskList extends React.Component {
  render() {
    let tasks = this.props.tasks;
    console.log(this.props.list);
    let task = tasks[this.props.list];
    let list = task.subtasks;
    if (this.props.list!=="$Complete") {
      list = list.filter(t=>!tasks[t].completed);
    }
    list = list.map((t,i)=><TaskItem key={i} n={i} taskid={t} {...this.props}/>);
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
    e.preventDefault();
    let text = this._textInput.value;
    if (text) {
      let task = this.props.newTask({label: text});
      // if the list is an autofilter, create a new task that fits the fitler
      if (autofilters[this.props.list]) {
        let auto = autofilters[this.props.list];
        let updates = auto.update(task, this.props.tasks);
        this.props.modifyTasks(updates);
      } else {
        // otherwise add an unmodified new task
        let list = clone(this.props.tasks[this.props.list]);
        if (!list.subtasks) {
          list.subtasks = [];
        }
        list.subtasks.push(task.id);
        this.props.modifyTasks([
          task,
          list
        ]);
      }
      this._textInput.value = "";
    }
  }
  render() {
    return (
      <form onSubmit={this.handleAdd}>
        <input ref={e=>this._textInput=e} type="text" style={{width: "40%"}}/>
        <br/>
        <button type="submit">Add task</button>
      </form>
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
    if (tasks[taskid].static) {
      return;
    }
    let list = clone(tasks[this.props.taskid]);
    // if the list is an autofilter, update the task to fit the list
    if (autofilters[list.id]) {
      this.props.modifyTasks(autofilters[list.id].update(tasks[taskid], tasks));
    } else {
      // otherwise, add the task to the list's subtasks
      if (!list.subtasks.includes(taskid)) {
        list.subtasks.push(taskid);
      }
      // do I want to remove it from old lists? not yet.
      this.props.modifyTasks([list]);
    }
  }
  handleDelete = (e)=>{
    let task = this.props.tasks[this.props.taskid];
    if (task.static) {
      return;
    }
    this.props.deleteTasks([this.props.taskid]);
  }
  handleComplete = (e)=>{
    let task = clone(this.props.tasks[this.props.taskid]);
    if (task.static) {
      return;
    }
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
    let {taskid, tasks, n, list} = this.props;
    let task = tasks[taskid];
    let title = tasks[taskid].notes;
    return <li 
      title={title}
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
        <span style={{display: "inline-block", paddingTop: "5px"}}>{task.label}</span>
      </span>
      <span style={{float: "right"}}>
        <button title="complete" onClick={this.handleComplete} style={{
          color: task.static ? "gray" : "black"
        }}>{"\u2713"}</button>
        <button title="details" onClick={this.handleDetails}>{"?"}</button>
        <button title="subtasks" onClick={this.handleSubtasks} style={{
          fontWeight: (task.subtasks && task.subtasks.length>0) ? "bold" : "normal"
        }}>{"\u2261"}</button>
        <button title="sort up" style={{
          color: (n>0) ? "black" : "gray"
        }} onClick={this.handleSortUp}>{"\u2191"}</button>
        <button title="sort down" onClick={this.handleSortDown} style={{
          color: (n<tasks[list].subtasks.length-1) ? "black" : "gray"
        }}>{"\u2193"}</button>
        <button title="delete" style={{
          color: task.static ? "gray" : "black"
        }} onClick={this.handleDelete}>{"\u2717"}</button>
      </span>
    </li>
  }
}