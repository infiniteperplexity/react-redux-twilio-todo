class TaskDetails extends React.Component {
  render() {
    return (
      <div>
        {this.props.details}
        <span style={{float: "right"}}>
          <button>Okay</button>
          <button>Cancel</button>
        </span>
      </div>
    );
  }
}