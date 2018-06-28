let store;
let dbTasks = {};
// set up static task lists
let $Static = ["$Tasks","$Inbox","$Complete","$Lists","$Calendar"]
for (let task of $Static) {
  dbTasks[task] = {
    id: task,
    label: task.slice(1),
    subtasks: [],
    static: true
  }
  dbTasks.$Tasks.subtasks.push(dbTasks[task]);
}

let dummyDbConnection = {
  tasks: dbTasks,
  read: function() {
    setTimeout(()=>{
      store.dispatch({type: "gotTasks", tasks: this.tasks});
      console.log("updated app from database");
    },0);
  },
  update: function(tasks) {
    setTimeout(()=>{
      for (let task of tasks) {
        this.tasks[task.id] = task;
      }
      console.log("database updated");
    });
  },
  delete: function(ids) {
    setTimeout(()=>{
      for (let id of ids) {
        delete this.tasks[id];
      }
      console.log("database updated");
    });
  }
}

function getTasks() {
  dummyDbConnection.read();
}

function updateTasks(tasks) {
  dummyDbConnection.update(tasks);
}

function deleteTasks(ids) {
  dummyDbConnection.delete(ids);
}