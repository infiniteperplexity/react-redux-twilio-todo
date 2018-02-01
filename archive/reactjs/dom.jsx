var heading = document.querySelector("#colorHeading");
 
class ColorLabel extends React.Component {
  render() {
    return ReactDOM.createPortal(
      ": " + this.props.color,
      heading
    );
  }
}

class Colorizer extends React.Component {
  constructor(props, context) {
  super(props, context);
    this.state = {
      color: "",
      bgColor: "white"
    };
    //this.colorValue = this.colorValue.bind(this);
    //this.setNewColor = this.setNewColor.bind(this);
  }
  colorValue = (e) => {
    this.setState({ 
      color: e.target.value 
    });
  }
  setNewColor = (e) => {
    this.setState({
      bgColor: this.state.color
    });
    e.preventDefault();
  }
  render() {
    var squareStyle = {
      backgroundColor: this.state.bgColor
    };

    return (
      <div className="colorArea">
        <div style={squareStyle} className="colorSquare"></div>
        <form onSubmit={this.setNewColor}>
          <input onChange={this.colorValue}
            placeholder="Enter a color value"
            ref={(e)=>this._input=e}></input>
          <button type="submit">go</button>
        </form>
        <ColorLabel color={this.state.bgColor}/>
      </div>
    );
  }
}

ReactDOM.render(
  <div>
    <Colorizer />
  </div>,
  document.querySelector("#container")
);