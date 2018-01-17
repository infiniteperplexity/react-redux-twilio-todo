let destination = document.querySelector("#container");
const ROWS = 9;
const COLS = 9;
const BOMBS = 10;

class App extends React.Component {
  render() {
    return (
      <div>
        <BombGridHOC />
      </div>
    );
  }
}

class BombGrid extends React.Component {
  renderRow = (row,i) => {
    let renderCell = (cell,j) => {
      // need to set font color eventually
      let symbol;
      if (this.props.rows[i][j].revealed) {
        if (this.props.rows[i][j].bomb) {
          symbol = String.fromCodePoint(0x1F4A3);
        } else {
          console.log(countBombs(this.props.rows,i,j)); 
          symbol = countBombs(this.props.rows,i,j);
        }
      } else if (this.props.rows[i][j].flagged) {
        symbol = "\u26A0\uFE0F";
      } else {
        symbol = "\u2753\uFE0F";
      }
      return (<button
        className="minecell"
        key={i+","+j}
        onContextMenu={(e)=>{
          this.props.toggleFlag(i,j);
          e.preventDefault();
        }}
        onClick={(e)=>{
          this.props.reveal(i,j);
          e.preventDefault();
        }}
      >
        {symbol}
      </button>);
    };
    return (<div key={i}>{row.map(renderCell)}</div>);
  }
  render() {
    let rows = this.props.rows;
    let grid = rows.map(this.renderRow);
    return (
      <div>
        {grid}
      </div>
    )
  }
}

let BombGridHOC = ReactRedux.connect(
  (state) => ({rows: state.rows}),
  (dispatch) => ({
    toggleFlag: (i,j) => (dispatch({type: "FLAG", i: i, j: j})),
    reveal: (i,j) => (dispatch({type: "REVEAL", i: i, j: j}))
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
          neighbors: init[i][j].neighbors
        } : {
          bomb: false,
          revealed: false,
          flagged: false,
          neighbors: 0
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

//gotta figure out how this works vis-a-vis the reducer
function revealNeighbors(rows,i,j) {
  for (let x of [i-1,i,i+1]) {
    if (x<0 || x>=ROWS) {
      continue;
    }
    for (let y of [j-1,j,j+1]) {
      if (y<0 || y>=COLS || (x===i && y===j)) {
        continue;
      }
      //if (rows[])
      let bombs = rows[x][y].neighbors;
      if (bombs===0) {
        store.dispatch({type: "REVEAL", i: x, j: y});
        revealNeighbors(rows,x,y);
      }
    }
  }
}

function reducer(state, action) {
  if (state===undefined) {
    state = {rows: initRows()};
  }
  let rows;
  switch (action.type) {
    case "INITIALIZE":
      return {...state, rows: initRows()};
    case "REVEAL":
      rows = initRows(state.rows);
      rows[action.i][action.j].revealed = true;
      return {...state, rows: rows};
    case "FLAG":
      rows = initRows(state.rows);
      rows[action.i][action.j].flagged = (state.rows[action.i][action.j].flagged===false);
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

// floodfill
// neighbor count
// win/loss logic
// timer