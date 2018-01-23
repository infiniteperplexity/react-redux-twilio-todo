let parser = N3.Parser();
let preparsed = {
  rdf: 'http://www.w3.org/1999/02/22-rdf-syntax-ns#',
  rdfs: 'http://www.w3.org/2000/01/rdf-schema#',
  owl: 'http://www.w3.org/2002/07/owl#',
  dc: 'http://purl.org/dc/elements/1.1/',
  xsd: 'http://www.w3.org/2001/XMLSchema#',
}
preparsed[''] = "#";
let store = N3.Store({prefixes: preparsed});
let writer = N3.Writer({prefixes: preparsed});
writer.addTriples(store.getTriples());
writer.end((err, res)=>(console.log(res)));

let user = "TEST";
//let user = "GLENN";
let filters = {
	complete: function(task) {
		return (task in this.props.completed && !(task in this.props.repeating));
	},
	inbox: function(task) {
		return (!(task in this.props.completed) && !(task in this.props.repeating));
	},
	repeating: function(task) {
		return (task in this.props.repeating);
	},
	all: function(task) { return true;}
}

// database connection functions
function getTriples() {
	fetch('db.'+user).then((res)=>{
		if (res.status!==200) {
	        //store.dispatch({type: "FAIL_UPDATE", response: res});
	    } else {
			//res.json().then((data)=>store.dispatch({type: "DB_UPDATE", data: data}));
		}
	});
}

function updateTriples(triples) {	
	triples = triples || store.getTriples().map((triple)=>[triple.subject,triple.object,triple.predicate]);
	fetch('db.'+user, {
		method: 'POST',
		headers: new Headers({'Content-Type': 'application/json;charset=UTF-8'}),
		body: JSON.stringify(triples)
	}).then((res)=>{
		if (res.status!==200) {
	        store.dispatch({type: "FAIL_UPDATE", response: res});
	    } else {
			//res.json().then((data)=>store.dispatch({type: "DB_UPDATE", data: data}));
		}
	});
}

class Provider extends Component {
	getChildContext() {
		return {
			store: this.props.store
		}
	}
	render() {
		return this.props.children;
	}
}
Provider.childContextTypes = {
	store: React.PropTypes.object
}
function tripleStoreSubscribe(WrappedComponent, tripleStore) {
	class NewClass extends React.Component {
		constructor(props, context) {
			super(props, context);
			this.state = {
				data.
			};
		}
		render() {
			return <WrappedComponent data={this.state.data} {...this.props} />
		}
	}
	NewClass.contextTypes = {
		store: React.PropTypes.object;
	}
}


/*
So...to roll my own thing here...
function withSubscription(WrappedComponent, selectData) {
  // ...and returns another component...
  return class extends React.Component {
    constructor(props) {
      super(props);
      this.handleChange = this.handleChange.bind(this);
      this.state = {
        data: selectData(DataSource, props)
      };
    }

    componentDidMount() {
      // ... that takes care of the subscription...
      DataSource.addChangeListener(this.handleChange);
    }

    componentWillUnmount() {
      DataSource.removeChangeListener(this.handleChange);
    }

    handleChange() {
      this.setState({
        data: selectData(DataSource, this.props)
      });
    }

    render() {
      // ... and renders the wrapped component with the fresh data!
      // Notice that we pass through any additional props
      return <WrappedComponent data={this.state.data} {...this.props} />;
    }
  };
}


const CommentListWithSubscription = withSubscription(
  CommentList,
  (DataSource) => DataSource.getComments()
);

const BlogPostWithSubscription = withSubscription(
  BlogPost,
  (DataSource, props) => DataSource.getBlogPost(props.id)
);



*/