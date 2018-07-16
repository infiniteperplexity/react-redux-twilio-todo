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
let user = (window.location.pathname==="/plate/GLENN") ? "GLENN" : "GUEST";
// GET
function getTasks() {
  fetch('db.'+user).then(res=>{
    if (res.status!==200) {
        alert("failed to get data");
    } else {
      res.json().then(data=>{
        let tasks = {};
        for (let row of data) {
          // this is silently failiung when it hits the quotes in "resolution"
          let task;
          try {
            task = JSON.parse(row);
            tasks[task.id] = task;
          } catch (e) {
            console.log("couldn't parse "+row);
          }   
        }
        store.dispatch({type: "gotTasks", tasks: tasks})
      });
    };
  })
}

// POST
function updateTasks(tasks) {
  let body = {
    deletes: tasks.map(t=>t.id),
    inserts: tasks
  };
  fetch('db.'+user, {
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
          try {
            let task = JSON.parse(row);
            tasks[task.id] = task;
          } catch (e) {
            console.log("couldn't parse "+row);
          }
        });
        console.log(tasks);
        store.dispatch({type: "gotTasks", tasks: tasks})
      });
    }
  });
}

function deleteTasks(ids) {
  let body = {
    deletes: ids,
    inserts: []
  };
  fetch('db.'+user, {
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
        store.dispatch({type: "gotTasks", tasks: tasks})
      });
    }
  });
}


function purgeUser(user) {
  let route = (user) ? ('purge.'+user) : "purge";
  fetch(route, {
    method: 'POST',
    headers: new Headers({'Content-Type': 'application/json;charset=UTF-8'})
  }).then((res)=>{
    if (res.status!==200) {
        alert("failed to post data");
    } else {
      let message = (user) ? (" user "+user) : " all users";
      console.log("purged " + message);
    }
  });
}

let autofilters = {
  $Complete: {
    filter: tasks=>{
      let complete = tasks.$Complete;
      for (let id in tasks) {
        let task = tasks[id];
        if (task.completed && !complete.subtasks.includes(id)) {
          complete.subtasks.push(id);
        }
      }
      complete.subtasks = complete.subtasks.filter(id=>tasks[id].completed);
      return tasks;
    },
    update: (task, tasks)=>{
      task.completed = moment().unix();
      return [task];
    },
    order: 2
  },
  $Calendar: {
    filter: tasks=>{
      let dailies = tasks.$Calendar;
      for (let id in tasks) {
        let task = tasks[id];
        if (task.repeats==="daily" && !dailies.subtasks.includes(id)) {
          dailies.subtasks.push(id);
        }
      }
      dailies.subtasks = dailies.subtasks.filter(id=>tasks[id].repeats==="daily");
      return tasks;
    },
    update: (task, tasks)=>{
      task.repeats = "daily";
      return [task];
    },
    order: 1
  },
  $Lists: {
    // I dunno if this is how I want to do it.
    filter: tasks=>tasks,
    update: (task, tasks)=>{
      if (!tasks.$Lists.subtasks.includes(task.id)) {
        tasks.$Lists.subtasks.push(task.id);
        return [task, tasks.$Lists];
      }
      return [task];
    },
    order: 4
  },
  $Inbox: {
    filter: tasks=>{
      let inbox = tasks.$Inbox;
      let listed = [];
      for (let id in tasks) {
        let task = tasks[id];
        if (task.subtasks && id!=="$Inbox" && id!=="$Tasks") {
          listed = listed.concat(task.subtasks);
        }
      }
      for (let id in tasks) {
        if (!listed.includes(id) && !inbox.subtasks.includes(id)  && tasks[id].static!==true) {
          inbox.subtasks.push(id);
        }
      }
      inbox.subtasks = inbox.subtasks.filter(id=>!listed.includes(id));
      return tasks;
    },
    update: (task, tasks)=>{
      let updates = [task];
      for (let id in tasks) {
        let t = tasks[id];
        if (id!=="$Inbox" && t.subtasks && t.subtasks.includes(task.id)) {
          t = clone(tasks[id]);
          t.subtasks = t.subtasks.filter(i=>i!==task.id);
          updates.push(t);
        }
      }
      return updates;
    },
    order: 0
  },
  $Tasks: {
    filter: tasks=>{
      let master = tasks.$Tasks;
      for (let id in tasks) {
        let task = tasks[id];
        if (!master.subtasks.includes(id)) {
          master.subtasks.push(id);
        }
      }
      return tasks;
    },
    update: (task, tasks)=>[task],
    order: 3
  }
}

