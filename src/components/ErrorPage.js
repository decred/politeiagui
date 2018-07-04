import React from "react";
import Message from "./Message";

const ErrorPage = ({ error }) => (
  <div className="content" role="main">
    <div className="page error-page">
      <Message
        type="error"
        header="Internal Server Error"
        children={
          <div>
            <p>
              Something is wrong with the server.
            </p>
            {error && (
              <p>
                {{error}}
              </p>
            )}
            <p>
              You can try reloading the page. If the error persists, please try again in a few minutes.
            </p>
            <button onClick={() => window.location.href = "/"}>
              Refresh Page
            </button>
          </div>
        } />
    </div>
  </div>
);

export default ErrorPage;
