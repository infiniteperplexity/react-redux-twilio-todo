let store;

let dummyDbConnection = {
  tasks: [],
  read: function() {
    setTimeout(()=>{
      store.dispatch({type: "gotTasks", tasks: this.tasks});
      console.log("updated app from database");
    },0);
  },
  update: function(tasks) {
    setTimeout(()=>{
      for (let task of tasks) {
        this.tasks[task.id] = task;
      }
      console.log("database updated");
    });
  },
  delete: function(ids) {
    setTimeout(()=>{
      for (let id of ids) {
        delete this.tasks[id];
      }
      console.log("database updated");
    });
  }
}

function getTasks() {
  dummyDbConnection.read();
}

function updateTasks(tasks) {
  dummyDbConnection.update(tasks);
}

function deleteTasks(ids) {
  dummyDbConnection.delete(ids);
}

function App(props, context) {
  return <TaskList {...props} />;
}

function TaskList(props, context) {
  return <div className="grid">hello world!</div>
}

let AppComponent = ReactRedux.connect(
  (state)=>({
    ...state
  }),
  (dispatch)=>({
      addTask: (task)=>dispatch({type: "addTask", task: task}),
      deleteTask: (task)=>dispatch({type: "deleteTask", task: task}),
      modifyTask: (task)=>dispatch({type: "modifyTask", task: task})
  })
)(App);


//a reducer function for a Redux store
function reducer(state, action) {
  if (state === undefined) {
    return {tasks: []};
  }
  if (action.type==="getTasks") {
    getTasks();
  } else if (action.type==="gotTasks") {
    return {...state, tasks: action.tasks};
  } else if (action.type==="addTask") {
    updateTasks([]);
    return {...state};
  } else if (action.type==="deleteTask") {
    deleteTasks([]);
    return {...state};
  } else if (action.type==="modifyTask") {
    updateTasks([]);
    return {...state};
  } else {
    console.log(state);
    throw new Error("unknown store action type");
    return state;
  }
}

store = Redux.createStore(reducer);
let destination = document.querySelector("#container");

ReactDOM.render(
  <ReactRedux.Provider store={store}>
    <AppComponent />
  </ReactRedux.Provider>,
  destination
);



window.onpopstate = function(event) {
    if (event.state) {}
};

window.history.replaceState({}, "emptyTitle", window.location);