//https://www.kirupa.com/react/
let destination = document.querySelector("#container");
 
class Display extends React.Component {
  render() {
    console.log(this.props.color);
    return (
      <div>
        <p>{this.props.color}</p>
        <p>{this.props.num}</p>
        <p>{this.props.size}</p>
      </div>
    );
  }
}
 
class Label extends React.Component {
  render() {
    return (
      <Display {...this.props}/>
    );
  }
}
 
class Shirt extends React.Component {
  render() {
    return (
      <div>
        <Label {...this.props}/>
      </div>
    );
  }
}
 
ReactDOM.render(
  <div>
    <Shirt color="steelblue" num="3.14" size="medium" />
  </div>,
  document.querySelector("#container")
);
