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
      store.dispatch({type: "gotTasks", tasks: this.denormalize()});
      console.log("updated app from database");
    },0);
  },
  update: function(tasks) {
    setTimeout(()=>{
      console.log("updating database");
      for (let task of tasks) {
        this.tasks[task.id] = task;
      }
      this.validate();
      console.log("database updated");
      this.read();
    });
  },
  delete: function(ids) {
    setTimeout(()=>{
      for (let id of ids) {
        if (this.tasks[id]) {
          delete this.tasks[id];
        }
      }
      this.validate();
      console.log("database updated");
      this.read();
    });
  },
  validate: function() {
    this.normalize();
  },
  normalize: function() {
    // the only thing so far is making sure subtask membership gets updated
    for (let id in this.tasks) {
      let task = this.tasks[id];
      let dels = [];
      if (task.subtasks) {
        for (let sub of task.subtasks) {
          if (!this.tasks[sub]) {
            dels.push(sub);
          }
        }
        // oh and delete denormalized properties
        if (dels.length>0) {
          task.subtasks = task.subtasks.filter(t=>!dels.includes(t));
        }
      } else {
        task.subtasks = [];
      }
      dels = [];
      if (task.lists) {
        for (let list of task.lists) {
          if (this.tasks[list] && !this.tasks[list].subtasks.includes(id)) {
            this.tasks[list].subtasks.push(id);
          }
        }
        delete task.lists;
      }
    }
  },
  denormalize: function() {
    let tasks = clone(this.tasks);
    // convert to useful hierarchical data
    for (let id in tasks) {
      let task = tasks[id];
      if (!task.lists) {
        task.lists = [];
      }
      for (let sub of task.subtasks) {
        let subtask = tasks[sub];
        if (!subtask.lists) {
          subtask.lists = [];
        }
        if (!subtask.lists.includes(id)) {
          subtask.lists.push(id);
        }
      }
    }
    return tasks;
  }
}

// function getTasks() {
//   dummyDbConnection.read();
// }

// function updateTasks(tasks) {
//   dummyDbConnection.update(tasks);
// }

function deleteTasks(ids) {
  dummyDbConnection.delete(ids);
}

// GET
function getTasks() {
  // fetch('plate/db').then(res=>{
  fetch('db.TEST').then(res=>{
    if (res.status!==200) {
        alert("failed to get data");
    } else {
      res.json().then(data=>{
        let tasks = {};
        data.map(row=>{
          let task = JSON.parse(row);
          tasks[task.id] = task;
        });
        console.log(tasks);
        store.dispatch({type: "gotTasks", tasks: denormalize(tasks)})
      });
    };
  })
}
// Assuming server-side validation...and denormalization

// POST
function updateTasks(tasks) {
  let body = {
    deletes: [tasks.map(t=>t.id)],
    inserts: tasks
  };
  console.log("testing!");
  console.log(body);
  // fetch('plate/db', {
  fetch('db.TEST', {
    method: 'POST',
    headers: new Headers({'Content-Type': 'application/json;charset=UTF-8'}),
    body: JSON.stringify(body)
  }).then((res)=>{
    if (res.status!==200) {
        alert("failed to post data");
    } else {
      res.json().then(data=>{
        let tasks = {};
        data.map(row=>{
           let task = JSON.parse(row);
          tasks[task.id] = task;
        });
        console.log(tasks);
        store.dispatch({type: "gotTasks", tasks: denormalize(tasks)})
      });
    }
  });
}

function setupUser(user) {
  let $Static = ["$Tasks","$Inbox","$Complete","$Lists","$Calendar"];
  let inserts = [];
  for (let list of $Static) {
    let task = {
      id: list,
      label: list.slice(1),
      subtasks: [],
      lists: ["$Tasks"],
      static: true
    }
    inserts.push(task);
    inserts[0].subtasks.push(list);
  }
  let body = {
    deletes: [],
    inserts: inserts
  };
  // fetch('plate/db', {
  fetch('db.' + user, {
    method: 'POST',
    headers: new Headers({'Content-Type': 'application/json;charset=UTF-8'}),
    body: JSON.stringify(body)
  }).then((res)=>{
    if (res.status!==200) {
        alert("failed to post data");
    } else {
      res.json().then(data=>{
        let tasks = {};
        data.map(row=>{
          let task = JSON.parse(row);
          tasks[task.id] = task;
        });
        store.dispatch({type: "gotTasks", tasks: denormalize(tasks)})
      });
    }
  });
}

function denormalize(tasks) {
  // convert to useful hierarchical data
  for (let id in tasks) {
    let task = tasks[id];
    if (!task.lists) {
      task.lists = [];
    }
    for (let sub of task.subtasks) {
      let subtask = tasks[sub];
      if (!subtask.lists) {
        subtask.lists = [];
      }
      if (!subtask.lists.includes(id)) {
        subtask.lists.push(id);
      }
    }
  }
  return tasks;
}