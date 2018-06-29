class TaskDetails extends React.Component {
  handleSubmit = (e)=>{
    this.props.chooseDetails(null);
  }
  handleCancel = (e)=>{
    this.props.chooseDetails(null);
  }
  render() {
    return (
      <div>
        {this.props.details}
        <span style={{float: "right"}}>
          <button onClick={this.handleSubmit}>Submit</button>
          <button onClick={this.handleCancel}>Cancel</button>
        </span>
      </div>
    );
  }
}