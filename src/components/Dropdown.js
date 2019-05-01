import React, { Component } from "react";
import ReactDOM from "react-dom";
import PropTypes from "prop-types";

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
    if (this.props.disabled) return;
    this.setState(state => ({
      isopen: !state.isopen
    }));
  }
  handleClick(e) {
    if (ReactDOM.findDOMNode(this).contains(e.target)) return;
    this.setState({ isopen: false });
  }
  componentDidMount() {
    document.addEventListener("click", this.handleClick, false);
  }
  componentWillUnmount() {
    document.removeEventListener("click", this.handleClick, false);
  }
  render() {
    const {
      DropdownTrigger,
      DropdownContent,
      dropdownContentStyle: dpdownCttStyleFromProps,
      dropdownTriggerStyle: dpdownTrggStyleFromProps,
      hideDropdownIcon,
      disabled
    } = this.props;
    const { isopen } = this.state;
    const dropdownContentStyle = {
      position: "absolute",
      top: "36px",
      right: "-16px",
      border: "1px solid rgba(255, 255, 255, .8)",
      backgroundColor: "#091440",
      width: "200px",
      ...dpdownCttStyleFromProps
    };
    const dropdownTriggerStyle = {
      cursor: disabled ? "normal" : "pointer",
      ...dpdownTrggStyleFromProps
    };
    const angleStyle = {
      marginLeft: "5px",
      position: "relative"
    };
    const DropdownTriggerWithProps = React.cloneElement(DropdownTrigger, {
      style: dropdownTriggerStyle
    });
    const DropdownContentWithProps = React.cloneElement(DropdownContent, {
      style: dropdownContentStyle
    });
    return (
      <div className="dropdown-ct">
        <div className="dropdown" onClick={this.handleTriggerClick}>
          {DropdownTriggerWithProps}
          {hideDropdownIcon ? null : <span style={angleStyle}>&#9662;</span>}
        </div>
        {isopen && DropdownContentWithProps}
      </div>
    );
  }
}

Dropdown.propTypes = {
  DropdownTrigger: PropTypes.element.isRequired,
  DropdownContent: PropTypes.element.isRequired,
  dropdownContentStyle: PropTypes.object,
  dropdownTriggerStyle: PropTypes.object,
  disabled: PropTypes.bool,
  hideDropdownIcon: PropTypes.bool
};

export default Dropdown;
