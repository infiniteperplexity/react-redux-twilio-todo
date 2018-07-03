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
      created: moment().unix(),
      ...args
    }),
    ...state
  }),
  (dispatch)=>({
      addTasks: (tasks)=>dispatch({type: "addTasks", tasks: tasks}),
      deleteTasks: (tasks)=>dispatch({type: "deleteTasks", tasks: tasks}),
      modifyTasks: (tasks)=>dispatch({type: "modifyTasks", tasks: tasks}),
      chooseList: (list)=>dispatch({type: "chooseList", list: list}),
      chooseDetails: (details)=>dispatch({type: "chooseDetails", details: details}),
      chooseDate: (date)=>dispatch({type: "chooseDate", date: date})
  })
)(App);

ReactDOM.render(
  <ReactRedux.Provider store={store}>
    <AppComponent />
  </ReactRedux.Provider>,
  destination
);
