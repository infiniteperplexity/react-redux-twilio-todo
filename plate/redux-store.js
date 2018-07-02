store = Redux.createStore(reducer);

//a reducer function for a Redux store
function reducer(state, action) {
  console.log("store dispatch:");
  console.log(action);
  if (state === undefined) {
    console.log("initializing store");
    let tasks = {};
    for (let task of $Static) {
      tasks[task] = {
        id: task,
        label: task.slice(1),
        subtasks: [],
        lists: ["$Tasks"],
        static: true
      }
      tasks.$Tasks.subtasks.push(task);
    }
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
  } else if (action.type==="addTasks") {
    let tasks = action.tasks;
    for (let task of tasks) {
      if (task.lists) {
        for (let list of task.lists) {
          if (!tasks[list]) {
            tasks[list] = clone(state.tasks[list]);
          }
          if (!tasks[list].subtasks.includes(task.id)) {
            tasks[list].subtasks.push(task.id);
          }
        }
        delete task.lists;
      }
    }
    updateTasks(tasks);
    return state;
  } else if (action.type==="deleteTasks") {
    deleteTasks(action.tasks);
    return state;
  } else if (action.type==="modifyTasks") {
    updateTasks(action.tasks);
    return state;
  } else if (action.type==="chooseList") {
    if (!state.tasks[action.list]) {
      return state;
    }
    window.history.pushState({storeState: {list: state.list, details: state.details}}, "emptyTitle");
    return {...state, date: moment().startOf('day'), list: action.list};
  } else if (action.type==="chooseDetails") {
    if (action.details && !state.tasks[action.details]) {
      return state;
    }
    window.history.pushState({storeState: {list: state.list, details: state.details}}, "emptyTitle");
    return {...state, details: action.details};
  } else if (action.type==="chooseDate") {
    return {...state, date: action.date};
  }  else {
    console.log(state);
    throw new Error("unknown store action type");
    return state;
  }
}
store.dispatch({type: "getTasks"});

let destination = document.querySelector("#container");

window.onpopstate = function(event) {
    if (event.state) {
      let {list, details} = event.state.storeState;
      store.dispatch({type: "chooseList", list: list});
      store.dispatch({type: "chooseDetails", details: details});
    }
};
let _state = store.getState();
window.history.replaceState({storeState: {list: _state.list, details: _state.details}}, "emptyTitle", window.location);