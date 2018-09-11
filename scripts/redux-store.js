store = Redux.createStore(reducer);

//a reducer function for a Redux store
function reducer(state, action) {
  console.log("store dispatch:");
  console.log(action);
  if (state === undefined) {
    console.log("initializing store");
    let tasks = {};
    for (let f in autofilters) {
      if (!tasks[f]) {
        tasks[f] = {
          id: f,
          label: f.slice(1),
          subtasks: [],
          static: true
        }
      }
      tasks = autofilters[f].filter(tasks);
    }
    return {
      tasks: tasks,
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
    let tasks = action.tasks;
    for (let id in tasks) {
      let task = tasks[id];
      // clean up deleted tasks
      if (task.subtasks) {
        task.subtasks = task.subtasks.filter(id=>tasks[id]);
      }
    }
    // clean up autofilters
    for (let f in autofilters) {
      if (!tasks[f]) {
        tasks[f] = {
          id: f,
          label: f.slice(1),
          subtasks: [],
          static: true
        }
      }
      tasks = autofilters[f].filter(tasks);
    }
    console.log(tasks);
    return {...state, tasks: tasks};
  } else if (action.type==="deleteTasks") {
    deleteTasks(action.tasks);
    return state;
  } else if (action.type==="modifyTasks") {
    // not sure where this validation should happen
    for (let task of action.tasks) {
      if (task.repeats==="daily") {
        let days = [moment().startOf('day')];
        // try eight days, in case we don't want to count the current one
        for (let i=0; i<7; i++) {
          let day = moment(days[days.length-1]);
          days.push(day.subtract(1,'days'));
        }
        let numerator = 0;
        let denominator = 0;
        let useEight = false;
        if (!task.occasions) {
          task.occasions = {};
        }
        for (let i=0; i<days.length; i++) {
          let day = days[i];
          if (i===0 && task.occasions[day.unix()]===undefined) {
            useEight = true;
            continue;
          } else if (i===7 && useEight===false) {
            break;
          }
          let occ = task.occasions[day.unix()];
          console.log(occ);
          if (occ!==undefined) {
            numerator+=occ;
            denominator+=1;
          }
        }
        task.summaries = {
          weeklyTotal: numerator,
          weeklyDays: denominator
        }
      }
    }
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