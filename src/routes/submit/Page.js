import { h } from "preact";
import style from "./style";
import LoadingPage from "../../components/LoadingPage";
import MarkdownEditor from "../../components/MarkdownEditor";

const SubmitPage = ({
  name,
  description,
  onSetName,
  onSetDescription,
  isSaving,
  error
}) => isSaving ? <LoadingPage /> : (
  <div class={style.submitProposal}>
    <h2>
      <input {...{
        placeholder: "Proposal Name",
        value: name,
        onChange: e => onSetName(e.target.value)
      }} />
      <button className={"submit"}>Save</button>
    </h2>
    {error ? (
      <div className={"error"}>
        Error: {error.toJS()}
        <pre>{JSON.stringify(error, null, 2)}</pre>
      </div>
    ) : null}
    <MarkdownEditor {...{
      value: description,
      onChange: onSetDescription
    }} />
  </div>
);

export default SubmitPage;
