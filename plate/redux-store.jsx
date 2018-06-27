let store;

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
    return {}
  }
  if (action.type==="addTask") {
    return state;
  } else if (action.type==="deleteTask") {
    return state;
  } else if (action.type==="modifyTask") {
    return state;
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