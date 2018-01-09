let destination = document.querySelector("#container");

class HelloWorld extends React.Component {
  render() {
    return <p>Hello, {this.props.greetTarget}!</p>;
  }
}

class Buttonify extends React.Component {
    render() {
      return(
      <div>
        <button type={this.props.behavior}>{this.props.children}</button>
      </div>
      );
  }
}

ReactDOM.render(
  <div>
    <HelloWorld greetTarget="Glenn"/>
    <HelloWorld greetTarget="Brigid"/>
    <HelloWorld greetTarget="Doodle"/>
    <HelloWorld greetTarget="Flores"/>
    <HelloWorld greetTarget="Blucifer"/>
    <Buttonify behavior="submit">SEND DATA</Buttonify>
  </div>,
  destination
);