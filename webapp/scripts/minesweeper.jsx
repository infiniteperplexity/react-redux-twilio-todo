let destination = document.querySelector("#container");
const ROWS = 9;
const COLS = 9;
const BOMBS = 9;

class BombGrid extends React.Component {
  reveal = (i,j) => {
    this.props.reveal(i,j);
    // force an early state update so we can use recursion
    this.props.rows[i][j].revealed = true;
    if (this.props.rows[i][j].bomb) {
      this.props.explode(i,j);
      this.revealAll();
      this.props.stopTime();
      this.props.gameOver();
      return;
    } else if (this.props.rows[i][j].neighbors===0) {
      for (let x of [i-1,i,i+1]) {
        // skip if out of bounds
        if (x<0 || x>=ROWS) {
          continue;
        }
        for (let y of [j-1,j,j+1]) {
          // skip if out of bounds
          if (y<0 || y>=COLS) {
            continue;
          }
          // skip if already revealed
          if (this.props.rows[x][y].revealed) {
            continue;
          }
          this.reveal(x,y);
        }
      }
    }
    this.checkAll();
  }
  revealAll = () => {
    for (let i=0; i<ROWS; i++) {
      for (let j=0; j<COLS; j++) {
        if (!this.props.rows[i][j].revealed) {
          this.props.reveal(i,j);
        }
      }
    }
  }
  checkAll = () => {
    if (!this.props.active) {
      return;
    }
    for (let i=0; i<ROWS; i++) {
      for (let j=0; j<COLS; j++) {
        let cell = this.props.rows[i][j];
        if (!cell.bomb && !cell.revealed) {
          return;
        }
      }
    }
    alert("you win!");
    this.props.stopTime();
    this.props.gameOver();
  }
  render() {
    let rows = this.props.rows;
    let grid = [];
    for (let i=0; i<rows.length; i++) {
      let row = [];
      grid.push([<div key={i}>{row}</div>]);
      for (let j=0; j<rows[i].length; j++) {
        let symbol;
        if (this.props.rows[i][j].revealed) {
          if (this.props.rows[i][j].exploded) {
            symbol = String.fromCodePoint(0x1F4A5);
          } else if (this.props.rows[i][j].bomb) {
            symbol = String.fromCodePoint(0x1F4A3);
          } else {
            symbol = countBombs(this.props.rows,i,j);
          }
        } else if (this.props.rows[i][j].flagged) {
          symbol = "\u26A0\uFE0F";
        } else {
          symbol = "\u2753\uFE0F";
        }
        row.push(
          <button
            className="minecell"
            symbol={symbol}
            key={j}
            onContextMenu={(e)=>{
              if (this.props.active) {
                this.props.toggleFlag(i,j);
              }
              e.preventDefault();
            }}
            onClick={(e)=>{
              if (this.props.active) {
                this.reveal(i,j);
              }
              e.preventDefault();
            }}
          >
            {symbol}
          </button>
        )
      }
    }
    return (
      <div>
        {grid}
      </div>
    )
  }
}

let BombGridHOC = ReactRedux.connect(
  (state) => ({rows: state.rows, active: state.active}),
  (dispatch) => ({
    toggleFlag: (i,j) => (dispatch({type: "FLAG", i: i, j: j})),
    reveal: (i,j) => (dispatch({type: "REVEAL", i: i, j: j})),
    stopTime: ()=> (dispatch({type: "STOPTIME"})),
    gameOver: ()=> (dispatch({type: "GAMEOVER"})),
    explode: (i,j)=> (dispatch({type: "EXPLODE", i: i, j: j}))
  })
)(BombGrid);

function initRows(init) {
  let rows = [];
  for (let i=0; i<ROWS; i++) {
    rows.push([]);
    for (let j=0; j<COLS; j++) {
      let cell = (init) ?
        { bomb: init[i][j].bomb,
          revealed: init[i][j].revealed,
          flagged: init[i][j].flagged,
          neighbors: init[i][j].neighbors,
          exploded: init[i][j].exploded,
        } : {
          bomb: false,
          revealed: false,
          flagged: false,
          neighbors: 0,
          exploded: false
        };
      rows[i].push(cell);
    }
  }
  if (!(init)) {
    let placed = 0;
    do {
      let i = Math.floor(Math.random()*ROWS);
      let j = Math.floor(Math.random()*COLS);
      if (rows[i][j].bomb===false) {
        placed+=1;
        rows[i][j].bomb = true;
      }
    } while (placed<BOMBS);
    for (let i=0; i<ROWS; i++) {
      for (let j=0; j<COLS; j++) {
        rows[i][j].neighbors = countBombs(rows,i,j);
      }
    }
  }
  return rows;
}

function countBombs(rows,i,j) {
  let bombs = 0;
  for (let x of [i-1,i,i+1]) {
    if (x<0 || x>=ROWS) {
      continue;
    }
    for (let y of [j-1,j,j+1]) {
      if (y<0 || y>=COLS || (x===i && y===j)) {
        continue;
      }
      if (rows[x][y].bomb) {
        bombs+=1;
      }
    }
  }
  return bombs;
}

class ControlPanel extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.timer();
  }
  newGame = () => {
    this.props.newGame();
    this.timer();
  }
  timer = () => {
    this.props.startTime(setInterval(this.props.seconds,1000));
  }
  render() {
    let {minutes, seconds} = this.props.time;
    if (String(minutes).length<2) {
      minutes = "0"+minutes;
    }
    if (String(seconds).length<2) {
      seconds = "0"+seconds;
    }

    return (
      <div>
        <button onClick={this.newGame}>New Game</button>
        <span id="spacer"></span>
        <button onClick={(e)=>{e.preventDefault();}}>{minutes+":"+seconds}</button>
      </div>
    );
  }
}

let ControlPanelHOC = ReactRedux.connect(
  (state) => ({time: state.time, active: state.active}),
  (dispatch) => ({
    newGame: () => dispatch({type: "INITIALIZE"}),
    startTime: (interval) => dispatch({type: "STARTTIME", interval: interval}),
    seconds: () => dispatch({type: "SECOND"})
  })
)(ControlPanel);



class App extends React.Component {
  render() {
    return (
      <div>
        <BombGridHOC />
        <ControlPanelHOC />
      </div>
    );
  }
}

function reducer(state, action) {
  if (state===undefined) {
    state = {rows: initRows(), time: {minutes: 0, seconds: 0}, active: null};
  }
  let rows;
  switch (action.type) {
    case "INITIALIZE":
      return {...state, rows: initRows(), time: {minutes: 0, seconds: 0}, active: null};
    case "STARTTIME":
      clearInterval(state.active);
      return {...state, active: action.interval};
    case "STOPTIME": 
      clearInterval(state.active);
      return {...state, active: null}
    case "REVEAL":
      rows = initRows(state.rows);
      rows[action.i][action.j].revealed = true;
      return {...state, rows: rows};
    case "FLAG":
      rows = initRows(state.rows);
      rows[action.i][action.j].flagged = (state.rows[action.i][action.j].flagged===false);
      return {...state, rows: rows};
    case "SECOND":
      let {minutes, seconds} = state.time;
      seconds++;
      if (seconds>=60) {
        seconds = 0;
        minutes++;
      }
      return {...state, time: {minutes: minutes, seconds: seconds}};
    case "EXPLODE":
      rows = initRows(state.rows);
      rows[action.i][action.j].exploded = true;
      return {...state, rows: rows};
    default:
      return state;
  }
}

let store = Redux.createStore(reducer);

ReactDOM.render(
  <ReactRedux.Provider store={store}>
    <App />
  </ReactRedux.Provider>,
  destination
);