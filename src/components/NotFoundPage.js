import React from "react";
import Message from "./Message";

const NotFoundPage = () => (
  <div className="content" role="main">
    <div className="page error-page">
      <Message
        type="error"
        header="Page not found"
        body="The requested page does not exist."
      />
    </div>
  </div>
);

export default NotFoundPage;
