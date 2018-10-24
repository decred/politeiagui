import React from "react";
import ModalWrapper from "./Modal/ModalContentWrapper";
import modalConnector from "../connectors/modal";
import FancyRadioButton from "./FancyRadioButton";

const durationOptions = [
  {
    value: 2016,
    text: "1 week"
  },
  {
    value: 2880,
    text: "10 days"
  },
  {
    value: 4032,
    text: "2 weeks"
  }
];

const MIN_QUORUM = 50;
const MAX_QUORUM = 100;
const MIN_PASS = 10;
const MAX_PASS = 100;

class StartVoteModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      duration: durationOptions[0].value,
      quorumPercentage: 75,
      passPercentage: 10
    };
  }
  onChangeDuration = duration =>
    this.setState({ duration })

  onChangeQuorumPercentage = event => {
    const quorumPercentage = parseInt(event.target.value, 10);
    if (quorumPercentage < MIN_QUORUM || quorumPercentage > MAX_QUORUM) {
      return;
    }
    this.setState({ quorumPercentage });
  }

  onChangePassPercentage = event => {
    const passPercentage = parseInt(event.target.value, 10);
    if (passPercentage < MIN_PASS || passPercentage > MAX_PASS) {
      return;
    }
    this.setState({ passPercentage });
  }

  handleSubmit = () => {
    const { quorumPercentage, passPercentage, duration } = this.state;
    this.props.me.callback(
      duration,
      quorumPercentage,
      passPercentage
    );
    this.props.closeModal();
  }

  render() {
    const { closeModal } = this.props;
    const { duration, quorumPercentage, passPercentage } = this.state;
    const fieldWrapper = {
      display: "flex",
      width: "220px",
      justifyContent: "space-between",
      alignItems: "center",
      marginTop: "10px"
    };

    return (
      <ModalWrapper
        title="Start Vote"
        onClose={closeModal}
        onSubmit={this.handleSubmit}
        submitText="Start Vote"
      >
        <form style={{ padding: "10px", display: "flex", flexDirection: "column", alignItems: "center" }}>
          <label>Duration:</label>
          <FancyRadioButton
            style={{ marginTop: "5px" }}
            options={durationOptions}
            value={duration}
            onChange={this.onChangeDuration}
          />
          <div style={fieldWrapper}>
            <label>Quorum percentage:</label>
            <input
              className="proposal-credits-input"
              type="number"
              value={quorumPercentage}
              onChange={this.onChangeQuorumPercentage}
            />
          </div>
          <div style={fieldWrapper}>
            <label>Pass percentage:</label>
            <input
              className="proposal-credits-input"
              type="number"
              value={passPercentage}
              onChange={this.onChangePassPercentage}
            />
          </div>

        </form>
      </ModalWrapper>
    );
  }
}


export default modalConnector(StartVoteModal);
