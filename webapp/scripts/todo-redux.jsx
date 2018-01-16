// a reducer function for a Redux store
let connection;
function reducer(state, action) {
  if (state === undefined) {
    return {tasks: []};
  }
  switch (action.type) {
    case "BEGIN_ADD_TASK":
      connection.addTask(action.task);
      return state;
    case "COMPLETE_ADD_TASK":
      return {...state, tasks: state.tasks.concat(action.task)};
    case "BEGIN_DELETE_TASK":
      connection.deleteTask(action.id);
      return state;
    case "COMPLETE_DELETE_TASK":
      return {...state, tasks: state.tasks.filter((e)=>(e.id!==action.id))};
    default:
      return state;
  }
}

let store = Redux.createStore(reducer);
connection = {
  addTask: function(task) {
    setTimeout(function() {store.dispatch({type: "COMPLETE_ADD_TASK", task: task});}, 50);
  },
  deleteTask: function(id) {
    setTimeout(function() {store.dispatch({type: "COMPLETE_DELETE_TASK", id: id});}, 50);
  }
};