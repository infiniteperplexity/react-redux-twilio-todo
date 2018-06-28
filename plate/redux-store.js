store = Redux.createStore(reducer);

//a reducer function for a Redux store
function reducer(state, action) {
  console.log("store dispatch:");
  console.log(action);
  if (state === undefined) {
    console.log("initializing store");
    return {tasks: {}};
  }
  if (action.type==="getTasks") {
    getTasks();
    return state;
  } else if (action.type==="gotTasks") {
    console.log("got tasks...");
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
store.dispatch({type: "getTasks"});

let destination = document.querySelector("#container");

window.onpopstate = function(event) {
    if (event.state) {}
};

window.history.replaceState({}, "emptyTitle", window.location);