import React from "react";
import distanceInWordsToNow from "date-fns/distance_in_words_to_now";
import currentUserConnector from "../connectors/currentUser";
import * as modalTypes from "./Modal/modalTypes";

class SessionExpiresIndicator extends React.Component {
  interval = null
  constructor(props) {
    super(props);
    this.state = {
      timer: null
    };
  }
  finishInterval = () => {
    clearInterval(this.interval);
    this.interval = null;
    this.props.onLogout();
    this.setState({ timer: null });
    this.props.openModal(modalTypes.LOGIN, {
      title: "Your session has expired. Please log in again."
    }, null);
  }
  intervalProcedure = () => {
    let { timer } = this.state;
    const { sessionTimeLeft } = this.props;

    if (timer != null) { // timer is running
      // decrease timer
      const newTimer = --timer;
      return newTimer < 1 ?
        this.finishInterval() :
        this.setState({ timer: newTimer });
    }

    this.setState({ timer: sessionTimeLeft });
  }
  startInterval = () => {
    const intervalPeriod = 1000; // 1 second
    this.interval = setInterval(this.intervalProcedure, intervalPeriod);
  }
  componentDidUpdate() {
    const { sessionTimeLeft, loggedInAsEmail } = this.props;
    const { timer } = this.state;
    const lessThan10MinutesLeft = sessionTimeLeft <= 600;
    const moreThan1SecondLeft = sessionTimeLeft >= 1;
    const shouldStartInterval = (
      loggedInAsEmail && lessThan10MinutesLeft && moreThan1SecondLeft
      && this.interval === null && timer === null
    );

    if (shouldStartInterval) {
      this.startInterval();
    }
  }
  render() {
    const { timer } = this.state;
    return timer ? (
      <div className="session-expiration">
        {"current session expires "}
        {
          distanceInWordsToNow(
            timer * 1000 + Date.now(),
            { addSuffix: true }
          )
        }
      </div>
    ) : null;
  }
}


export default currentUserConnector(SessionExpiresIndicator);
