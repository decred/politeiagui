import { h } from "preact";
import Markdown from "../../components/MarkdownRenderer";

const SuccessPage = ({
  name,
  description,
  merkle,
  token,
  signature
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
  </div>
);

export default SuccessPage;
