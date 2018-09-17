//http://ccoenraets.github.io/es6-tutorial-react/setup/
const port = process.env.PORT || 8080;
const path = require("path");
const express = require('express');
const pg = require('pg');
const sqlstring = require('sqlstring');
const fs = require('fs');
const bodyParser = require('body-parser');
const request = require('request');
const moment = require('moment');

let sid = process.env.TWILIO_SID;
let token = process.env.TWILIO_TOKEN;
let fromNumber = process.env.TWILIO_FROM;
let toNumber = process.env.TWILIO_TO;
const twilio = require('twilio')(sid, token);
const cron = require('node-cron');


const app = express();
app.use(bodyParser.json({limit: '50mb'}));


function escape(s) {
  if (typeof(s)==="boolean") {
    return String("'"+s+"'");
  }
  let san = sqlstring.escape(s);
  san = san.replace(/\\'/g,"''");
  return san;
}
function unescape(s) {
  let SPACER = "\u0000";
  let SREGEX = new RegExp(SPACER,"g");
  let unsan = s.replace(/\\n/g,SPACER);
  unsan = unsan.replace(/\\/g,"");
  unsan = unsan.replace(SREGEX,"\n");
  unsan = unsan.replace(/''/g,"'");
  return unsan;
}

// function escape(s) {return s};
// function unescape(s) {return s};

app.get('/', function(req, res) {
   res.sendFile(path.join(__dirname, '/index.html'));
   //res.sendFile(path.join(__dirname, '/mobile.html'));
});

app.get('/GLENN', function(req, res) {
   res.sendFile(path.join(__dirname, '/index.html'));
   //res.sendFile(path.join(__dirname, '/mobile.html'));
});

app.get('/plate/GLENN', function(req, res) {
   res.sendFile(path.join(__dirname, '/index.html'));
   //res.sendFile(path.join(__dirname, '/mobile.html'));
});

app.get('/*.js*', function(req, res) {
  console.log(path.join(__dirname, req.url));
   res.sendFile(path.join(__dirname, req.url));
});

app.listen(port, () => console.log('Example app listening on port'+port+'!'))


/********************************************************/
app.get('/dbfix', (req, res) => {
  // this should refresh from a different table in the database...the user BACKUP
});
// function dbfix(user, fname) {
//   fs.readFile(__dirname+"/saved/"+fname, function read(err, data) {
//     if (err) {
//         throw err;
//     }
//     let resources = JSON.parse(data).map(({subject, predicate, object})=>[subject, predicate, object]);
//     let inserts = [];
//     for (let [s, p, o] of resources) {
//       inserts.push('('+escape(s));
//       inserts.push(escape(p));
//       inserts.push(escape(o));
//       inserts.push("'"+user+"')");
//     }
//     let insert = inserts.join(',');
//     pg.connect(process.env.DATABASE_URL, (err, client, done) => {
//       console.log("deleting rows");
//       client.query("DELETE FROM quads WHERE graph = $1",[user], (err) => {
//         if (err) {
//           done();
//           console.error(err);
//         } else {
//           if (inserts.length>0) {
//             console.log("inserting rows");
//             console.log(insert);
//             // this part seems vulnerable to duplicates...
//             client.query('INSERT INTO quads (subject,predicate,object,graph) VALUES '+insert, (err)=> {
//               if (err) {
//                 console.log("had an error inserting rows");
//                 done();
//                 console.error(err);
//               }
//             });
//           }
//         }
//       });
//     });
//   });
// }

function sendMessage(btxt) {
  twilio.api.messages.create({
    body: btxt,
    to: toNumber,
    from: fromNumber
  }).then(data=>console.log("message sent."))
  .catch(err=>console.log(err));
}

function generateReport(tasks) {
  let repeats = [];
  for (let id in tasks) {
    let task = tasks[id];
    if (task.repeats==="daily" && task.summaries) {
      console.log("recalculating daily test");
      let days = [moment().startOf('day')];
      // try eight days, in case we don't want to count the current one
      for (let i=0; i<7; i++) {
        let day = moment(days[days.length-1]);
        days.push(day.subtract(1,'days'));
      }
      let numerator = 0;
      let denominator = 0;
      let useEight = false;
      if (!task.occasions) {
        task.occasions = {};
      }
      for (let i=0; i<days.length; i++) {
        let day = days[i];
        if (i===0 && task.occasions[day.unix()]===undefined) {
          useEight = true;
          continue;
        } else if (i===7 && useEight===false) {
          break;
        }
        let occ = task.occasions[day.unix()];
        if (occ!==undefined) {
          numerator+=occ;
          denominator+=1;
        }
      }
      task.summaries = {
        weeklyTotal: numerator,
        weeklyDays: denominator
      }
      let repeat = "Summary for " + task.label + ": "
      + "\n  Weekly total: " + task.summaries.weeklyTotal
      + "\n  Weekly average: " + (task.summaries.weeklyTotal/task.summaries.weeklyDays).toFixed(2);
      if (task.summaries.weeklyDays===0) {
        repeat = "No weekly entries for " + task.label + ".";
      }
      repeats.push(repeat);
    }
  }
  return repeats.join("\n");
}//



function unescape2(task) {
  let unescapes = [
    /\\\\\\\"/g,
    /\\\\n/g
  ];
  let replacers = [
    '\\\"',
    '\\n'
  ];
  let swappers = unescapes.map((_,i)=>("\u0000"+i));
  let regexes = swappers.map(s=>new RegExp(s,"g"));
  for (let i=0; i<unescapes.length; i++) {
    task = task.replace(unescapes[i], swappers[i]);
  }
  task = task.replace(/\\/g,"");
  for (let i=0; i<unescapes.length; i++) {
    task = task.replace(regexes[i], replacers[i]);
  }
  return task;
}
function extractTasks(callback) {
  pg.connect(process.env.DATABASE_URL, (err, client, done) => {
    if (err) {
      done();
      console.log(error);
    } else {
      client.query("SELECT * FROM tasks WHERE assignee = 'GLENN'", (err, result) => {
        if (err) {
          done();
          console.error(err);
        } else {
          let tasks = {};
          console.log(result.rows);
          for (let row of result.rows) {
            // tasks[row.id] = JSON.parse(JSON.stringify(unescape(row.task)));
            tasks[row.id] = JSON.parse(unescape2(row.task));            
          }
          console.log("report generated");
          console.log(tasks);
          callback(tasks);
        }
      });
    }
  });
}

function chooseMessage() {
  let messages = [
    "Hi Glenn, have you recorded your dailies today?",
    "Remember how important it is to record your dailies, Glenn.",
    "Now would be a great time to record your dailies, don't you think?",
    "Nine in the morning, time to record your dailies!"
  ];
  let txt = messages[Math.floor(Math.random()*messages.length)];
  return txt;
}



function clearGuest() {
  pg.connect(process.env.DATABASE_URL, (err, client, done) => {
    console.log("deleting guest rows");
    client.query("DELETE FROM tasks WHERE assignee = 'GUEST'", (err) => {
      if (err) {
        done();
        console.error(err);
      } else {
        console.log("cleared guest rows");
      }
    });
  });
}

let cleanse = cron.schedule("0 0 * * *",clearGuest);
cleanse.start();

// function doReminders() {
//   sendMessage(chooseMessage());
// }

function doReminders() {
  extractTasks((tasks)=>{
    sendMessage(generateReport(tasks));
  });
}

let task = cron.schedule("15 9 * * *",doReminders);
task.start();



let stayAwake = setInterval(()=>{
  request("http://day-on-a-plate.herokuapp.com/",(err)=>{
    if (err) {
      console.log(err);
    }
    console.log("...keeping dyno awake...");
  });
},1000*60*20);


app.get('/db.*', function(req, res) {
  let user = req.url.split(".")[1];
  if (escape(user)!==("'"+user+"'")) {
    console.log("no special characters allowed in user name.");
    console.log(err);
    res.status(404).send();
    return;
  }
  pg.connect(process.env.DATABASE_URL, (err, client, done) => {
    console.log("selecting rows");
    client.query("SELECT * FROM tasks WHERE assignee = $1",[user], (err, result) => {
      done();
      if (err) {
        console.log(err);
        console.log("had an error retrieving rows.");
        res.status(500).send();
        return;
      }
      let tasks = result.rows.map(row=>row.task);
      res.send(JSON.stringify(tasks));
    });
  });
});




app.post('/db.*', function(req, res) {
  let user = req.url.split(".")[1];
  if (escape(user)!==("'"+user+"'")) {
    console.log("no special characters allowed in user name.");
    console.log(err);
    res.status(404).send();
    return;
  }
  console.log("received rows");
  console.log(req.body);
  // rows to delete
  let deletes = [];
  //req.body.deletes;
  for (let id of req.body.deletes) {
    deletes.push('(id = ' + escape(id) + ' AND assignee = ' + "'"+user+"')");
  }
  if (deletes.length===0) {
    // dummy that's never true
    deletes = "2+2 = 5";
  } else {
    deletes = deletes.join(' OR ');
  }
  // rows to insert
  let inserts = [];
  console.log(req.body.inserts);
  for (let task of req.body.inserts) {
    inserts.push("("+sqlstring.escape(user));
    inserts.push(sqlstring.escape(task.id));
    inserts.push(sqlstring.escape(JSON.stringify(task))+")");
  }
  let insert = inserts.join(',');
  console.log(deletes);
  console.log(inserts);
  //insert = insert + " ON CONFLICT (id) DO UPDATE SET (username, password, level, email) = (EXCLUDED.username, EXCLUDED.password, EXCLUDED.level, EXCLUDED.email)";
  let backup;
  let status = 200;
  // backup not currently active
  // I really should learn how to use aync / await
  pg.connect(process.env.DATABASE_URL, (err, client, done) => {
    console.log("deleting rows");
      client.query("DELETE FROM tasks WHERE "+deletes, (err) => {
      if (err) {
        done();
          console.error(err);
      } else {
        if (inserts.length>0) {
          console.log("inserting rows");
          console.log(insert);
          // this part seems vulnerable to duplicates...
          // client.query('INSERT INTO tasks (assignee, id, task) VALUES ('+insert+')', (err)=> {
          client.query('INSERT INTO tasks (assignee, id, task) VALUES '+insert+'', (err)=> {
            if (err) {
              console.log("had an error inserting rows");
              done();
              console.error(err);
            } else {
              client.query("SELECT * FROM tasks WHERE assignee = $1",[user],(err, result)=>{
                done();
                if (err) {
                  console.log("had an error retrieving updated rows.");
                  res.status(500).send();
                }
                let tasks = result.rows.map(row=>row.task);
                res.send(JSON.stringify(tasks));

              });
            }
          });
        } else {
          client.query("SELECT * FROM tasks WHERE assignee = $1",[user],(err, result)=>{
            done();
            if (err) {
              console.log("had an error retrieving updated rows.");
              res.status(500).send();
            }
            // let tasks = result.rows.map(row=>unescape(row.task));
            let tasks = result.rows.map(row=>row.task);
            console.log("sending rows");
            console.log(tasks);
            res.send(JSON.stringify(tasks));
          });
        }
      }
    });
  });
});



app.post('/purge.*', function(req, res) {
  let user = req.url.split(".")[1];
  if (escape(user)!==("'"+user+"'")) {
    console.log("no special characters allowed in user name.");
    console.log(err);
    res.status(404).send();
    return;
  }
  pg.connect(process.env.DATABASE_URL, (err, client, done) => {
  console.log("deleting rows");
    client.query("DELETE FROM tasks WHERE assignee = $1",[user],(err, result)=>{
      done();
    });
  });
});

app.post('/purge', function(req, res) {
  pg.connect(process.env.DATABASE_URL, (err, client, done) => {
  console.log("deleting rows");
    client.query("DELETE FROM tasks",(err, result)=>{
      done();
    });
  });
});