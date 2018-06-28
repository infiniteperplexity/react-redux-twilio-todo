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
  // if (props.list==="$Calendar") {
    return (
      <div className="frame">
        <TaskCalendar {...props}/>
      </div>
    );
  // }
  return (
    <div className="frame">
      <TaskList {...props}/>
    </div>
  );
}

let AppComponent = ReactRedux.connect(
  (state)=>({
    newTask: (args)=>({
      id: uuid.v4(),
      subtasks: [],
      lists: [],
      ...args
    }),
    ...state
  }),
  (dispatch)=>({
      addTask: (task)=>dispatch({type: "addTask", task: task}),
      deleteTask: (task)=>dispatch({type: "deleteTask", task: task}),
      modifyTask: (task)=>dispatch({type: "modifyTask", task: task}),
      chooseList: (list)=>dispatch({type: "chooseList", list: list})
  })
)(App);

ReactDOM.render(
  <ReactRedux.Provider store={store}>
    <AppComponent />
  </ReactRedux.Provider>,
  destination
);
