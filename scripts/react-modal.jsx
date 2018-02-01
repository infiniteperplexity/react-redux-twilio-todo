function TaskModal(props) {
  if (!props.app.modify.id) {
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
    </div>
  );
}

class TaskModalControls extends React.Component {
  handleSubmit = ()=> {
    let tasks = this.props.tasks;
    let task = {...this.props.tasks[this.props.app.modify.id]};
    let modify = {...this.props.app.modify};
    task.label = modify.label;
    task.inputs = modify.inputs;
    task.repeats = modify.repeats;
    task.comments = modify.comments;
    this.props.modifyTask(task);
    this.props.setControl("modify", {})
  }
  render() {
    return (
      <div>
        <div>
          Label: <ModalLabelInput {...this.props} />
        </div>
        <div>
          Inputs: <ModalInputsType {...this.props} />
        </div>
        <div>
          Repeats: <ModalRepeatsInput {...this.props} />
        </div>
        <div>
          Comments: <br /><ModalCommentsInput {...this.props} />
        </div>
        <div style={{overflow: "hidden"}}>
          <span style={{float: "right"}}>
            <button className="btn" onClick={this.handleSubmit}>
              Submit
            </button>
            <button className="btn" onClick={e=>this.props.setControl("modify", {})}>
              Cancel
            </button>
          </span>
        </div>
      </div>
    );
  }
}

class ModalLabelInput extends React.Component {
  handleChange = (event) => {
    event.preventDefault();
    let modify = {...this.props.app.modify, label: event.target.value};
    this.props.setControl("modify",modify);
  }
  render() {
    return (
      <input  type="text"
              value={this.props.app.modify.label} 
              onChange={this.handleChange}
      />
    );
  }
}
class ModalInputsType extends React.Component {
  handleChange = (event) => {
    event.preventDefault();
    let modify = {...this.props.app.modify, inputs: event.target.value};
    this.props.setControl("modify",modify);
  }
  render() {
    return (
      <select value={this.props.app.modify.inputs}
              onChange={this.handleChange}
      >
        <option value="check">Check</option>
        <option value="number">Number</option>
      </select>
    );
  }
}
class ModalRepeatsInput extends React.Component {
  handleChange = (event) => {
    event.preventDefault();
    let modify = {...this.props.app.modify, repeats: event.target.value};
    this.props.setControl("modify",modify);
  }
  render() {
    return (
      <select value={this.props.app.modify.repeats}
              onChange={this.handleChange}
      >
        <option value="none">None</option>
        <option value="daily">Daily</option>
        <option value="instanty">Instant</option>
      </select>
    );
  }
}
class ModalCommentsInput extends React.Component {
  handleChange = (event) => {
    event.preventDefault();
    let modify = {...this.props.app.modify, comments: event.target.value};
    this.props.setControl("modify",modify);
  }
  render() {
    return (
      <textarea
              rows="12"
              cols="25"
              value={this.props.app.modify.comments} 
              onChange={this.handleChange}
      />
    );
  }
}
