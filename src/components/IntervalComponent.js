import React from "react";
import PropTypes from "prop-types";

class IntervalComponent extends React.Component {
  interval = null
  startInterval = () => {
    const { onInterval, intervalPeriod } = this.props;
    this.interval = setInterval(onInterval, intervalPeriod);
  }
  finishInterval = () => {
    clearInterval(this.interval);
    this.props.onFinishInterval();
  }
  componentDidUpdate(prevProps) {
    const { active } = this.props;
    if (!prevProps.active && active) {
      this.startInterval();
    } else if(prevProps.active && !active) {
      this.finishInterval();
    }
  }
  componentWillUnmount() {
    clearInterval(this.interval);
  }
  render() {
    return this.props.children;
  }
}

IntervalComponent.propTypes = {
  intervalPeriod: PropTypes.number.isRequired,
  onInterval: PropTypes.func.isRequired,
  onFinishInterval: PropTypes.func.isRequired,
  active: PropTypes.bool
};

export default IntervalComponent;
