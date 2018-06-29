
function TaskMenu(props, context) {
  let statics = [
    "$Inbox",
    "$Calendar",
    "$Complete",
    "$Tasks",
    "$Lists"
  ];
  let tasks = props.tasks;
  let lists = tasks.$Lists.subtasks;
  let list = statics.concat(lists).map((e,i)=><MenuListItem key={i} task={e} {...props}/>);
  list.splice(statics.length, 0, <hr key={-1}/>)
  return list;
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
    let list = clone(tasks[task]);
    if (!list.subtasks.includes(taskid)) {
      list.subtasks.push(taskid);
    }
    // swap names
    task = tasks[taskid];
    if (!task.lists.includes(list.id)) {
      task.lists.push(list.id); 
    }
    // do I want to remove it from old lists? not yet.
    this.props.modifyTasks([task, list]);
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
