store = Redux.createStore(reducer);

//a reducer function for a Redux store
function reducer(state, action) {
  console.log("store dispatch:");
  console.log(action);
  if (state === undefined) {
    console.log("initializing store");
    return {
      tasks: {},
      list: "$Inbox",
      details: null,
      report: null,
      date: moment().startOf('day')
    };
  }
  if (action.type==="getTasks") {
    getTasks();
    return state;
  } else if (action.type==="gotTasks") {
    return {...state, tasks: action.tasks};
  } else if (action.type==="addTask") {
    let task = action.task;
    let tasks = [task];
    // probably should do all the validation in a centralized place
    for (let listid of task.lists) {
      let list = clone(state.tasks[listid]);
      list.subtasks.push(task.id);
      tasks.push(list);
    }
    updateTasks(tasks);
    return {...state};
  } else if (action.type==="deleteTask") {
    deleteTasks([]);
    return {...state};
  } else if (action.type==="modifyTask") {
    updateTasks([]);
    return {...state};
  } else if (action.type==="chooseList") {
    return {...state, list: action.list};
  } else if (action.type==="chooseDetails") {
    return {...state, details: action.details};
  } else if (action.type==="chooseDate") {
    return {...state, details: action.date};
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