import { h } from "preact";
import LoadingPage from "../../components/LoadingPage";
import ErrorPage from "../../components/ErrorPage";
import { Link } from "preact-router/match";
import style from "./style";
import Markdown from "../../components/MarkdownRenderer";

const ProposalPage = ({
  isLoading,
  error,
  proposal
}) =>
  isLoading ? <LoadingPage /> : error ? <ErrorPage {...{ error }} /> : (
    <div class={style.proposalDetail}>
      <h2>{proposal.name}</h2>
      <div>
        Created {(new Date(proposal.timestamp * 1000)).toString()}
      </div>
      <hr />
      <Markdown value={proposal.files && proposal.files.length > 0 ? atob(proposal.files[0].payload) : ""} />
    </div>
  );

export default ProposalPage;
