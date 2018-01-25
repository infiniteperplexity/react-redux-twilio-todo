class SharedModal extends React.Component {
	render() {
		if (!this.props.app.modal) {
			return null;
		}
    return (
      <div className="apprframe taskmodal" style={{
        borderStyle: "solid",
        borderWidth: "1px",
        position: "absolute",
        zIndex: "1",
        height: "720px",
        width: "80%",
        left: "20%",
        top: "0%"
      }}>
        {this.props.app.modal.children}
        <div>
          <button className="btn" style={{float:"right"}} onClick={this.props.closeModal}>
            Cancel
          </button>
    			<button className="btn" style={{float:"right"}} onClick={
              ()=> {
                this.props.app.modal.submitModal();
                this.props.closeModal();
          }}>
            Okay
          </button>
        </div>
      </div>
    );
	}
}

let SharedModalHOC = ReactRedux.connect(
	(state) => ({app: state.app, task: state.tasks}),
	(dispatch) => ({
		closeModal: () => dispatch({type: "SET_MODAL", modal: null}),
		modifyTask: (task) => dispatch({type: "MODIFY_DATA", modify: [task]}),
		deleteTask: (id) => dispatch({type: "MODIFY_DATA", delete: [id]}),
		addTask: (task) => dispatch({type: "MODIFY_DATA", add: [task]})
	})
)(SharedModal);