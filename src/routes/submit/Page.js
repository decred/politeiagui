import { h } from "preact";
import style from "./style";
import { ReactMde, ReactMdeCommands } from "react-mde";

const SubmitPage = ({
  description,
  onSetDescription
}) => (
  <div class={style.submitProposal}>
    <h2><input placeholder={"Proposal Name"} /></h2>
    <ReactMde
      commands={ReactMdeCommands.getDefaultCommands()}
      value={description}
      onChange={() => console.log("wtf")}
    />
  </div>
);

export default SubmitPage;
