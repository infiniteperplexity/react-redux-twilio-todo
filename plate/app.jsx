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
      created: moment().unix(),
      ...args
    }),
    saveTasks: saveTasks,
    ...state
  }),
  (dispatch)=>({
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

function saveTasks() {
  let obj = store.getState().tasks;
  let fname = "tasks.json";
  let txt = (typeof(obj)==="string") ? obj : JSON.stringify(obj, null, 2); 
  let blob = new Blob([txt], {type : 'text/plain'});
  let url = window.URL.createObjectURL(blob);
  let p = prompt("Enter name for saved file:",fname);
  if (p.length<5 || p.substring(p.length-5)!==".json") {
    p = p+".json";
  }
  if (p) {
    let anchor = document.createElement("a");
    anchor.download = p;
    anchor.href = url;
    anchor.dataset.downloadurl = ['text/plain', anchor.download, anchor.href].join(':');
    document.body.appendChild(anchor);
    anchor.click();
    setTimeout(()=>{
      document.body.removeChild(anchor);
      window.URL.revokeObjectURL(url);
    }, 0);
  } 
  return p;
}


