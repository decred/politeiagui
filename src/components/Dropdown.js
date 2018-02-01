import React, {Component} from "react";
import ReactDOM from "react-dom";

class Dropdown extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isopen: false
    };
    this.handleTriggerClick = this.handleTriggerClick.bind(this);
    this.handleClick = this.handleClick.bind(this);
  }
  handleTriggerClick() {
    this.setState({
      isopen: !this.state.isopen
    });
  }
  handleClick(e) {
    if(ReactDOM.findDOMNode(this).contains(e.target)) return;
    this.setState({ isopen: false });
  }
  componentDidMount() {
    document.addEventListener("click", this.handleClick, false);
  }
  componentWillUnmount() {
    document.removeEventListener("click", this.handleClick, false);
  }
  render() {
    const {DropdownTrigger, DropdownContent} = this.props;
    const {isopen} = this.state;
    const dropdownContentStyle = {
      position: "absolute",
      top: "41px",
      right: "-16px",
      border: "1px solid rgba(255, 255, 255, .8)",
      backgroundColor: "#586D82",
      width: "200px"
    };
    const dropdownTriggerStyle = {
      cursor: "pointer"
    };
    const angleStyle = {
      marginLeft: "5px",
      position: "relative"
    };
    const angleStyleUp = {
      transform: "rotate(180deg)",
      top: "2px"
    };
    const DropdownTriggerWithProps = React.cloneElement(
      DropdownTrigger, {
        onClick: this.handleTriggerClick,
        style: dropdownTriggerStyle
      });
    const DropdownContentWithProps = React.cloneElement(
      DropdownContent,
      { style: dropdownContentStyle }
    );
    return <div style={{ position: "relative" }}>
      <div style={{ display: "flex", fontSize: "larger" }}>
        {DropdownTriggerWithProps}
        {isopen ?
          <span style={{...angleStyle, ...angleStyleUp}}>&#9662;</span>
          : <span style={angleStyle}>&#9662;</span>}
      </div>
      {isopen && DropdownContentWithProps}
    </div>;
  }
}

export default Dropdown;
