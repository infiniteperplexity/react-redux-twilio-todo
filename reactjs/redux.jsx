let destination = document.querySelector("#container");
 
// A basic React component with some properties that I don't manually create
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
// A Higher-Order Component made using ReactRedux.connect
  // attaches properties to the "wrapped" component
let App = ReactRedux.connect(
  (state)=>({countValue: state.count}),
  (dispatch)=>({
      increaseCount: ()=>{dispatch({type: "increase"})},
      decreaseCount: ()=>{dispatch({type: "decrease"})}
  })
)(Counter);

// a reducer function for a Redux store
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

// create the store inline
ReactDOM.render(
  <ReactRedux.Provider store={Redux.createStore(counter)}>
    <App />
  </ReactRedux.Provider>,
  destination
);


/*
Okay, let's review this redux stuff.

So, there's a store, created using Redux.createStore.  That's cool.
The store has a reducer.  The reducer is a function that takes a state and an "action"
and returns a state.  Is that the *entire* state?  Or just one piece of it?
It's the entire state, and in this case it's an associate array.
But in the previous example it was a normal array.  The reducer generally
contains a switch statement.

Now, there are several layers of "indirection" here...

1) There are functions that return "action objects"...which are like events.
2) You have to make those, because store.dispatch takes functions.  Oh, wrong.  It takes actions.  Got it.

store.getState() returns the state object.
Then you subscribe, and every time "dispatch" gets called, a function gets called.

So it seems that the indirection is probably necessary due to the way stuff is set up.


1) (optional) function that creates action objects.
2) action objects passed to store.dispatch.
3a) reducer updates store from action objects.
3b) subscribed functions called at end of dispatch.
4) subscribed functions, or other stuff, might use store.getState

In the next example, I don't understand why App would be a thing
if not for Redux.  Okay, so the Provider is the "component"
that holds the store, and it's at the top of the hierarchy so it can manage everything.

Higher-Order Components seem to be wrappers in the more conventional CS sense.

So it seems like ReactRedux.connect should almost *always* take
a mapStateToProps and a mapDispatchToProps as arguments.

Wait...what's "this.props" again?  Is that an object with...all JS-based methods associated with that component?
Oh, not even just that; props contains basically *everything*.  So the mapXToProps things both end up
with new methods attached to this.props?
...and they take X as their argument.  So for both of those, they return a map of property names to...
...well...okay.  The "state" on is a bit simpler...it returns a map of properties that might reference state.
Whereas "dispatch" returns a map of properties that are gonna be dispatch(someActionObject).  Which seem
to be, basically, new closures (I dunno if they're technically "curried".)

So...long story short, I'm def gonna need a cheatsheet.

Okay so wait...how does the App know about the store?  That seems to be handled internally using the hierarchy...
the only interface to it is <Provider store={store}>

So for ReactRedux...

1) Create a store using Redux.createStore().
2) Create a reducer for the store.
3) Create state2Props and mapDispatchToProps functions that return associative arrays of properties.
  - Most likely, state2Props will 
3) Create a Higher-Order Component that 
*/


