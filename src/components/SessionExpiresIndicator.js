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
    this.props.onLogout();
    this.setState({ timer: null });
    this.props.openModal(modalTypes.LOGIN, {
      title: "Your session has expired. Please log in again."
    }, null);
  }
  intervalProcedure = () => {
    let { timer } = this.state;
    const { sessionMaxAge, lastLoginTime } = this.props;
    const expiration = lastLoginTime + sessionMaxAge;
    const sessionTimeLeft = (expiration - Date.now()/1000);
    const validSessionTimeLeft = !isNaN(sessionTimeLeft);
    const lessThan10MinutesLeft = sessionTimeLeft < 600;

    if (timer != null && validSessionTimeLeft) { // timer is running
      // decrease timer
      const newTimer = --timer;
      return newTimer < 1 ?
        this.finishInterval() :
        this.setState({ timer: newTimer });
    }

    if (validSessionTimeLeft && lessThan10MinutesLeft) {
      this.setState({ timer: sessionTimeLeft });
    } else if (!validSessionTimeLeft) {
      this.setState({ timer: null });
    }
  }
  startInterval = () => {
    const intervalPeriod = 1000; // 1 second
    this.interval = setInterval(this.intervalProcedure, intervalPeriod);
  }
  componentDidMount() {
    this.startInterval();
  }
  componentWillUnmount() {
    clearInterval(this.interval);
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
