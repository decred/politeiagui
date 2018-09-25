import React from "react";
import distanceInWordsToNow from "date-fns/distance_in_words_to_now";
import IntervalComponent from "./IntervalComponent";
import currentUserConnector from "../connectors/currentUser";
import * as modalTypes from "./Modal/modalTypes";

class SessionExpiresIndicator extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      timer: null,
      activateInterval: false
    };
  }
  intervalProcedure = () => {
    let { timer } = this.state;
    const { sessionMaxAge, lastLoginTime } = this.props;
    const expiration = lastLoginTime + sessionMaxAge;
    const sessionTimeLeft = (expiration - Date.now()/1000);
    const validSessionTimeLeft = !isNaN(sessionTimeLeft);
    const lessThan10MinutesLeft = sessionTimeLeft < 20;

    if (timer != null && validSessionTimeLeft) { // timer is running
      // decrease timer
      const newTimer = --timer;
      return newTimer < 1 ?
        this.setState({ activateInterval: false }) :
        this.setState({ timer: newTimer });
    }

    if (validSessionTimeLeft && lessThan10MinutesLeft) {
      this.setState({ timer: sessionTimeLeft });
    } else if (!validSessionTimeLeft) {
      this.setState({ timer: null });
    }
  }
  finishInterval = () => {
    this.props.onLogout();
    this.setState({ timer: null });
    this.props.openModal(modalTypes.LOGIN, {
      title: "Your session has expired. Please log in again."
    }, null);
  }
  componentDidUpdate(prevProps) {
    const { loggedInAsEmail } = this.props;
    if(!prevProps.loggedInAsEmail && loggedInAsEmail) {
      // user has logged in
      // start the check for the session status
      this.setState({
        activateInterval: true
      });
    } else if (prevProps.loggedInAsEmail && !loggedInAsEmail) {
      // user has logged out
      // stop the check for the session status
      this.setState({
        activateInterval: false
      });
    }
  }
  render() {
    const { timer } = this.state;
    return (
      <IntervalComponent
        intervalPeriod={1000}
        onInterval={this.intervalProcedure}
        onFinishInterval={this.finishInterval}
        active={this.state.activateInterval}
      >
        {timer ?
          <div className="session-expiration">
            {"current session expires "}
            {
              distanceInWordsToNow(
                timer * 1000 + Date.now(),
                { addSuffix: true }
              )
            }
          </div> : null}
      </IntervalComponent>
    );
  }

}

export default currentUserConnector(SessionExpiresIndicator);
