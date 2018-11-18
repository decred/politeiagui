import React, { Component } from "react";
import Message from "../Message";

class InternalServerErrorMessage extends Component {
  render() {
    const { error } = this.props;
    return (
      <div className="content" role="main">
        <div className="page error-page">
          <Message
            type="error"
            header="Internal server error"
            children={
              <div>
                {error && <p>{error}</p>}
                <p>
                  You can try reloading the page. If the error persists, please
                  try again in a few minutes.
                </p>
              </div>
            }
          />
        </div>
      </div>
    );
  }
}

export default InternalServerErrorMessage;
