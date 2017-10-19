import React from "react";
import Markdown from "../MarkdownRenderer";
import ProposalImages from "../ProposalImages";

const SuccessPage = ({
  name,
  description,
  files,
  merkle,
  token,
  signature,
}) => (
  <div>
    <div>
      <h2>Successfully Submitted Proposal</h2>
      <div>Merkle: <span>{merkle}</span></div>
      <div>Token: <span>{token}</span></div>
      <div>Signature: <span>{signature}</span></div>
    </div>
    <h2>{name}</h2>
    <hr />
    <Markdown value={description} />
    <hr/>
    <ProposalImages files={files} />
  </div>
);

export default SuccessPage;
