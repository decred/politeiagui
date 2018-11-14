import React from "react";
import PropTypes from "prop-types";
import { applyMistakeFinders, getPreviewContent } from "./helpers";
import Message from "../Message";

class MarkdownLiveHelper extends React.Component {
  interval = null;

  constructor(props) {
    super(props);
    this.state = {
      show: false,
      findersResults: []
    };
  }

  componentDidMount() {
    this.interval = setInterval(() => {
      this.lookForMistakes();
    }, 1000);
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  lookForMistakes = () => {
    const { classToSelect } = this.props;
    const value = getPreviewContent(classToSelect);
    const { findersResults, anyMistake } = applyMistakeFinders(value);
    this.setState({
      show: anyMistake,
      findersResults
    });
  };

  renderMessages = findersResults => {
    return (
      <ul style={{ paddingLeft: "20px" }}>
        {findersResults.map((result, i) => (
          <li key={`rm-${i}`}>{result.message}</li>
        ))}
      </ul>
    );
  };

  render() {
    const { show, findersResults } = this.state;
    return show ? (
      <Message body={this.renderMessages(findersResults)} type="info" />
    ) : null;
  }
}

MarkdownLiveHelper.propTypes = {
  classToSelect: PropTypes.string.isRequired
};

export default MarkdownLiveHelper;
