let MOBILE = (window.screen.width<500);

function App(props, context) {
  // what about a mobile report?
  if (MOBILE) {
    return (
      <div className="app mobile">
        <MobilePanel {...props} />
      </div>
    );
  } else {
    return (
      <div className="grid app desktop">
        <MenuPanel {...props} />
        <MainPanel {...props} />
      </div>
    );
  }
}

function MenuPanel(props, context) {
  return (
    <div className="frame">
      <TaskMenu {...props}/>
    </div>
  );

}
function MainPanel(props, context) {
  if (props.details) {
    return (
      <div className="frame">
        <TaskDetails {...props}/>
      </div>
    );
  } else if (props.list==="$Calendar") {
    return (
      <div className="frame">
        <TaskCalendar {...props}/>
      </div>
    );
  }
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
      chooseList: (list)=>dispatch({type: "chooseList", list: list}),
      chooseDetails: (details)=>dispatch({type: "chooseList", details: details}),
      chooseDate: (date)=>dispatch({type: "chooseList", date: date})
  })
)(App);

ReactDOM.render(
  <ReactRedux.Provider store={store}>
    <AppComponent />
  </ReactRedux.Provider>,
  destination
);
