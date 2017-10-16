import React from "react";

const ProposalImages = ({ files, ...props }) => (
  <div {...props}>
    {(files || []).map(({ name, mime, digest, payload }, idx) => (
      <div key={digest || idx}>
        <h5>{name}</h5>
        <img alt={name} src={`data:${mime};base64,${payload}`} />
      </div>
    ))}
  </div>
);

export default ProposalImages;
