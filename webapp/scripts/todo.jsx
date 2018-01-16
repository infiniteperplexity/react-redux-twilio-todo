let destination = document.querySelector("#container");

class App extends React.Component {
  render() {
    return (
      <div>
        <TaskForm />
        <TaskList />
      </div>
    );
  }
}
class TaskForm extends React.Component {
  render() {
    return (
      <div>
        <form onSubmit={this.addTask}>
          <input ref={(e)=>(this._label=e)} placeholder="Enter task."></input>
          <input ref={(e)=>(this._comments=e)} placeholder="Enter comments."></input>
          <button type="submit">Add</button>
        </form>
      </div>
    )
  }
  addTask = (e) => {
    if (this._label.value !== "") {
      store.dispatch({
        type: "BEGIN_ADD_TASK",
        task: {
          id: uuid.v4(),
          label: this._label.value,
          comments: this._comments.value
        }
      });
      this._label.value = "";
      this._comments.value = "";
    }
    e.preventDefault();
  }
}

class TaskList extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = {tasks: []};
    store.subscribe(()=>(this.setState({tasks: store.getState().tasks})));
  }
  renderTask = (task) => {
    return <li key={task.id}>{task.label}<button onClick={()=>(this.deleteTask(task.id))}>Delete</button></li>
  }
  deleteTask = (id) => {
    store.dispatch({type: "BEGIN_DELETE_TASK", id: id});
  }
  render() {
    return (
      <ul>
        {this.state.tasks.map((task)=>(this.renderTask(task)))}
      </ul>
    );
  }
};