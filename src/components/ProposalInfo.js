import React from "react";

const liStyle = {
  padding: "2px"
};

const ProposalInfo = ({policy}) => (
  <ul style={{listStyle: "disc"}}>
    <li style={liStyle}>You must provide both a proposal name and description.</li>
    <li style={liStyle}>
      The proposal name must be between {policy.minnamelength} and {policy.maxnamelength} characters long{" "}
      and only contain the following characters: {policy.supportedcharacters.join(" ")}
    </li>
    <li style={liStyle}>Only 5 attachments are allowed.</li>
    <li style={liStyle}>The maximum size of an attached image is {policy.maximagesize} kb.</li>
    <li style={liStyle}>Valid mime types of items attached are:
      <ul style={{margin: "2px", paddingLeft: "15px", listStyle: "circle"}}>
        {policy.validmimetypes.map(mimetype => <li>{mimetype}</li>)}
      </ul>
    </li>
  </ul>
);

export default ProposalInfo;
