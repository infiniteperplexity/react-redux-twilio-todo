class TaskModal extends React.Component {
  setModalState = (control, value) => {
    let modal = {...this.props.app.modal};
    modal[control] = value;
    this.props.setControl("modal",modal);
  }
  render() {
    if (!props.app.modal) {
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
        <TaskModalControls {...props} />
        <ModalSubmission {...props} />
      </div>
    );
  }
}

/****
I really want the Modal to be presentation-only, which probably means that I need to do something
different than this...maybe not set_modal ID but rather task_details ID?  Yes.

***/
class ModalSubmission extends React.Component {
  handleSubmit = (event) => {
    let task = this.props.task;
    task = {
      ...task,
      label: this.props.app.modal.label,
      inputs: this.props.app.modal.inputs
    }
    this.props.modifyTask(task);
    this.props.closeModal();
  }
  render() {
    return (
      <div style={{overflow: "hidden"}}>
        <span style={{float: "right"}}>
          <button className="btn" onClick={this.handleSubmit}>
            Submit
          </button>
          <button className="btn" onClick={this.props.closeModal}>
            Cancel
          </button>
        </span>
      </div>
    );
  }
}


function TaskModalControls(props) {
  return (
    <div>
      <div>
        Label: <ModalLabelInput {...props} />
      </div>
      <div>
        Inputs: <ModalInputsType {...props} />
      </div>
      <ModalButtons />
    </div>
  );
}
//<div>
 //       Input Type: <ModalInputsType {...props} />
//      </div>

class ModalLabelInput extends React.Component {
  handleChange = (event) => {
    event.preventDefault();
    this.props.setControl("modalLabel",event.target.value);
  }
  render() {
    return (
      <input  type="text"
              value={this.props.app.modal.input} 
              onChange={this.handleChange}
      />
    );
  }
}
class ModalInputsType extends React.Component {
  handleChange = (event) => {
    e.preventDefault();
    console.log(event.target.value);
    this.props.setControl("modalInputsType",event.target.value);
  }
  render() {
    return null;
 /*   return (
      <select value={this.props.task.inputs}
              onChange={this.props.handleChange}
      >
        <option value="check">Check</option>
        <option value="number">Number</option>
      </select>
    );*/
  }
}