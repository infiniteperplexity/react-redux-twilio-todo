function clone(obj) {
  let nobj;
  if (typeof(obj)!=="object" || obj===null) {
    return obj;
  }
  if (Array.isArray(obj)) {
    nobj = [...obj];
    for (let i=0; i<nobj.length; i++) {
      nobj[i] = clone(nobj[i]);
    }
    return nobj;
  }
  nobj = {...obj};
  for (let prop in nobj) {
      if (typeof(nobj[prop])==="object") {
          nobj[prop] = clone(nobj[prop]);
      }
  }
  return nobj;
}

function merge(obj1, obj2) {
  if (!obj1) {
    return clone(obj2);
  }
  let nobj = clone(obj1);
  if (!obj2) {
    return nobj;
  }
  for (let prop in obj2) {
    if (typeof(obj2[prop])==="object") {
      if (typeof(nobj[prop])==="object") {
        nobj[prop] = merge(nobj[prop], obj2[prop]);
      } else if (nobj[prop]===undefined) {
        nobj[prop] = clone(obj2[prop]);
      }
    } else if (obj2[prop]!==undefined) {
      nobj[prop] = obj2[prop];
    }
  }
  return nobj;
}


let store;
let dbTasks = {};

function generateId() {
  return Math.random().toFixed(5);
}
// set up static task lists
let $Static = ["$Tasks","$Inbox","$Complete","$Lists","$Calendar"]
for (let task of $Static) {
  dbTasks[task] = {
    id: task,
    label: task.slice(1),
    subtasks: [],
    lists: ["$Tasks"],
    static: true
  }
  dbTasks.$Tasks.subtasks.push(task);
}

let dummyDbConnection = {
  tasks: dbTasks,
  read: function() {
    setTimeout(()=>{
      console.log("updating from database");
      store.dispatch({type: "gotTasks", tasks: this.tasks});
      console.log("updated app from database");
    },0);
  },
  update: function(tasks) {
    setTimeout(()=>{
      console.log("updating database");
      for (let task of tasks) {
        this.tasks[task.id] = task;
      }
      console.log("database updated");
      this.read();
    });
  },
  delete: function(ids) {
    setTimeout(()=>{
      for (let id of ids) {
        delete this.tasks[id];
      }
      console.log("database updated");
      this.read();
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