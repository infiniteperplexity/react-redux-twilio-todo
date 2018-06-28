function App(props, context) {
  return (
    <div className="grid app">
      <MenuPanel {...props}/>
      <MainPanel {...props}/>
    </div>
  );
}

function MenuPanel(props, context) {
  return (
    <div className="frame">
      <TaskMenu {...props}/>
    </div>
  );

}
function MainPanel(props, context) {
  return (
    <div className="frame">
      <TaskList {...props}/>
    </div>
  );
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

ReactDOM.render(
  <ReactRedux.Provider store={store}>
    <AppComponent />
  </ReactRedux.Provider>,
  destination
);
