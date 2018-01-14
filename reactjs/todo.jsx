let destination = document.querySelector("#container");

class TodoList extends React.Component {
  constructor(props, context) {
  	super(props, context);
  	this.state = {
    	items: []
  	};
  }
  render() {
    return (
      <div className="todoListMain">
        <div className="header">
          <form onSubmit={this.addItem}>
            <input ref={(a)=>this._inputElement=a} placeholder="enter task">
            </input>
            <button type="submit">add</button>
          </form>
        </div>
        <TodoItems entries={this.state.items} delete={this.deleteItem}/>
      </div>
    );
  }
  addItem = (e) => {
  	let itemArray = this.state.items;
 	  if (this._inputElement.value !== "") {
    	itemArray.unshift({
        	text: this._inputElement.value,
        	key: Date.now()
    	});
    	this.setState({
      		items: itemArray
    	});
    	this._inputElement.value = "";
  	}
  	console.log(itemArray);
  	e.preventDefault();
  }
  deleteItem = (key) => {
  	let filteredItems = this.state.items.filter((item)=>(item.key!==key));
  	this.setState({
    	items: filteredItems
  	});
  }
}

class TodoItems extends React.Component {
  createTasks = (item) => {
    return <li onClick={()=>this.delete(item.key)} key={item.key}>{item.text}</li>
  }
  delete = (key) => {
    this.props.delete(key);
  }
  render() {
    var todoEntries = this.props.entries;
    var listItems = todoEntries.map(this.createTasks);
    return (
      <ul className="theList">
      	<FlipMove duration={250} easing="ease-out">
          {listItems}
        </FlipMove>
      </ul>
    );
  }
};

ReactDOM.render(
	<div>
  		<TodoList/>
 	</div>,
	destination
);

// new concept..."Controlled Components" to sync state between React and forms
