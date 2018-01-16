let destination = document.querySelector("#container");
 
let Provider = ReactRedux.Provider;

 function counter(state, action) {
  if (state === undefined) {
    return { count: 0 };
  }
  let count = state.count;
  switch (action.type) {
    case "increase":
      return { count: count + 1 };
    case "decrease":
      return { count: count - 1 };
    default:
      return state;
  }
}

// Action
var increaseAction = { type: "increase" };
var decreaseAction = { type: "decrease" };
 
// Map Redux actions to component props
function mapDispatchToProps(dispatch) {
  return {
    increaseCount: function() {
      return dispatch(increaseAction);
    },
    decreaseCount: function() {
      return dispatch(decreaseAction);
    }
  }
}


class Counter extends React.Component {
  render() {
    return (
      <div className="container">
        <button className="buttons"
                onClick={this.props.decreaseCount}>-</button>
        <span>{this.props.countValue}</span>
        <button className="buttons"
                onClick={this.props.increaseCount}>+</button>
      </div>
    );
  }
};

function mapStateToProps(state) {
  return {
    countValue: state.count
  };
}
 

// The HOC
let App = ReactRedux.connect(
  mapStateToProps,
  mapDispatchToProps
)(Counter);

// Store
let store = Redux.createStore(counter);
   
ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  destination
);