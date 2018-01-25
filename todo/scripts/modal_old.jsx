class SharedModal extends React.Component {
	handleModal = (event) => {
		let triggerer = event.relatedTarget;
		document.getElementById("teetering").value = triggerer.getAttribute("custfield");
	}
	setModalHandler = () => {
		$('#myModal').on('show.bs.modal', this.handleModal);
	}
	componentDidMount = () => {
		this.setModalHandler();
	}
	componentDidUpdate = () => {	
		this.setModalHandler();
	}
	render() {
		return (
			<div className="modal fade" id="myModal" tabIndex="-1" >
				<div className="modal-dialog" role="document">
				    <div className="modal-content">
				      	<div className="modal-header">
				        	<h5 className="modal-title" id="exampleModalLabel">New message</h5>
				        	<button type="button" className="close" data-dismiss="modal" aria-label="Close">
				          		<span aria-hidden="true">&times;</span>
				        	</button>
				      	</div>
				      	<div className="modal-body">
				        	<form>
					          	<div className="form-group">
					            	<textarea id="teetering" className="form-control" defaultValue="nothing at all."></textarea>
					          	</div>
				        	</form>
				      	</div>
				      	<div className="modal-footer">
				        	<button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
				        	<button type="button" className="btn btn-primary">Send message</button>
				      	</div>
			    	</div>
			  	</div>
			</div>
		);
	}
}
let SharedModalHOC = ReactRedux.connect(
	(state) => ({app: state.app, task: state.tasks}),
	(dispatch) => ({})
)(SharedModal);


// class Modal extends React.Component {
//   render() {
//     // Render nothing if the "show" prop is false
//     if(!this.props.show) {
//       return null;
//     }

//     // The gray background
//     const backdropStyle = {
//       position: 'fixed',
//       top: 0,
//       bottom: 0,
//       left: 0,
//       right: 0,
//       backgroundColor: 'rgba(0,0,0,0.3)',
//       padding: 50
//     };

//     // The modal "window"
//     const modalStyle = {
//       backgroundColor: '#fff',
//       borderRadius: 5,
//       maxWidth: 500,
//       minHeight: 300,
//       margin: '0 auto',
//       padding: 30
//     };

//     return (
//       <div className="backdrop" style=>
//         <div className="modal" style=>
//           {this.props.children}

//           <div className="footer">
//             <button onClick={this.props.onClose}>
//               Close
//             </button>
//           </div>
//         </div>
//       </div>
//     );
//   }
// }

// Modal.propTypes = {
//   onClose: PropTypes.func.isRequired,
//   show: PropTypes.bool,
//   children: PropTypes.node
// };

// class App extends Component {
//   constructor(props) {
//     super(props);

//     this.state = { isOpen: false };
//   }

//   toggleModal = () => {
//     this.setState({
//       isOpen: !this.state.isOpen
//     });
//   }

//   render() {
//     return (
//       <div className="App">
//         <button onClick={this.toggleModal}>
//           Open the modal
//         </button>

//         <Modal show={this.state.isOpen}
//           onClose={this.toggleModal}>
//           Here's some content for the modal
//         </Modal>
//       </div>
//     );
//   }
// }