import React from "react";
import PropTypes from "prop-types";

/**
 * IntervalComponent executes a given function on a given interval
 * it will start the interval once the "active" prop changes from false to true
 * and it will end the interval once the "active" prop changes from true to false
 */
class IntervalComponent extends React.Component {
  interval = null;
  constructor(props) {
    super(props);
    this.state = { numberOfExecutions: 0 };
  }
  startInterval = () => {
    const { intervalPeriod, executeOnIntervalBeforeFirstInterval } = this.props;
    if (executeOnIntervalBeforeFirstInterval) {
      this.onInterval();
    }
    this.interval = setInterval(this.onInterval, intervalPeriod);
  };
  onInterval = () => {
    const { maxNumberOfExecutions, onInterval } = this.props;
    let { numberOfExecutions } = this.state;

    if (maxNumberOfExecutions && numberOfExecutions === maxNumberOfExecutions) {
      this.finishInterval();
    } else {
      this.setState({ numberOfExecutions: ++numberOfExecutions });
      onInterval();
    }
  };
  finishInterval = () => {
    clearInterval(this.interval);
    this.setState({ numberOfExecutions: 0 });
    this.props.onFinishInterval && this.props.onFinishInterval();
  };
  componentDidUpdate(prevProps) {
    const { active, startOnMount } = this.props;
    if (!startOnMount && !prevProps.active && active) {
      this.startInterval();
    } else if (prevProps.active && !active) {
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
  intervalPeriod: PropTypes.number.isRequired, // the length of the interval
  onInterval: PropTypes.func.isRequired, // the function to be executed
  executeOnIntervalBeforeFirstInterval: PropTypes.bool, // if true will execute the onInterval before the first period
  onFinishInterval: PropTypes.func, // what to execute once the interval has finished
  maxNumberOfExecutions: PropTypes.number, // how many times the onInterval should be executed
  active: PropTypes.bool // either the interval is active or not
};

export default IntervalComponent;
