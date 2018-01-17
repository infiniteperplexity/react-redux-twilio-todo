let destination = document.querySelector("#container");

class App extends React.Component {
  render() {
    return (
      <div>
        <TaskFormHOC />
        <TaskListHOC />
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
      this.props.addTask({
        id: uuid.v4(),
        label: this._label.value,
        comments: this._comments.value
      });
      this._label.value = "";
      this._comments.value = "";
    }
    e.preventDefault();
  }
}

let TaskFormHOC = ReactRedux.connect(
  (state) => ({}),
  (dispatch) => ({addTask: (task)=>(dispatch({type: "BEGIN_ADD_TASK", task: task}))})
)(TaskForm);

class TaskList extends React.Component {
  renderTask = (task) => {
    return <li key={task.id}>{task.label}<button onClick={()=>(this.deleteTask(task.id))}>Delete</button></li>
  }
  deleteTask = (id) => {
    this.props.deleteTask(id);
  }
  render() {
    return (
      <ul>
        {this.props.tasks.map((task)=>(this.renderTask(task)))}
      </ul>
    );
  }
};


let TaskListHOC = ReactRedux.connect(
  (state) => ({tasks: state.tasks}),
  (dispatch) => ({deleteTask: (id)=>(dispatch({type: "BEGIN_DELETE_TASK", id: id}))})
)(TaskList);


let store = Redux.createStore(reducer);
ReactDOM.render(
  <ReactRedux.Provider store={store}>
    <App />
  </ReactRedux.Provider>,
  destination
);