class TaskReport extends React.Component {
  render() {
    return (
      <div>
        {this.props.report}
        <span style={{float: "right"}}>
          <button>Okay</button>
          <button>Cancel</button>
        </span>
      </div>
    );
  }
}