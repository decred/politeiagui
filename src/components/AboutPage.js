import React from "react";
import ReactFileReader from "react-file-reader";

const AboutPage = () => (
  <div className="page about-page">
    <h1>About Politeia</h1>
    <p>We should describe Decred and the proposal system here</p>
    <ReactFileReader
      base64={true}
      handleFiles={(...args) => console.log(args)}
    >
      <button>Upload</button>
    </ReactFileReader>
  </div>
);

export default AboutPage ;
