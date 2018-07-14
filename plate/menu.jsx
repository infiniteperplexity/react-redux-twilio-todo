
class TaskMenu extends React.Component {
  handleSave = ()=>{
    this.props.saveTasks(this.props.tasks);
  }
  render() {
    let statics = [];
    for (let f in autofilters) {
      let auto = autofilters[f];
      statics[auto.order] = f;
    }
    let tasks = this.props.tasks;
    let lists = tasks.$Lists.subtasks;
    let list = statics.concat(lists).map((e,i)=><MenuListItem key={i} task={e} {...this.props}/>);
    list.splice(statics.length, 0, <hr key={-1}/>)
    list.unshift(<div key={-2}>
      <button onClick={this.handleSave}>Export</button>
      <button>Import</button>
    </div>);
    return list;
  }
}

class MenuListItem extends React.Component {
  handleChange = (e)=>{
    if (e.target.checked) {
      this.props.chooseList(this.props.task);
    }
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
    let {tasks, task} = this.props;
    if (tasks[taskid].static) {
      return;
    }
    let list = clone(tasks[task]);
    // if the list is an autofilter, update the task to fit the list
    if (autofilters[task]) {
      this.props.modifyTasks(autofilters[task].update(tasks[taskid], tasks));
    } else {
      // otherwise, add the task to the list's subtasks
      if (!list.subtasks.includes(taskid)) {
        list.subtasks.push(taskid);
      }
      // do I want to remove it from old lists? not yet.
      this.props.modifyTasks([list]);
    }
  }
  render() {
    let {task, tasks, list} = this.props;
    return (<div 
      onDragOver={this.allowDrop}
      onDrop={this.handleDrop}
      onDragLeave={this.handleLeave}
    >
      <input  type="radio"
              checked={list===task}
              onChange={this.handleChange}       
      />
      <span>{tasks[task].label}</span>
    </div>);
  }
}
