import { h } from "preact";
import LoadingPage from "../../components/LoadingPage";
import ErrorPage from "../../components/ErrorPage";
import { Link } from "preact-router/match";
import style from "./style";
import { Markdown } from "react-showdown";

const ProposalPage = ({
  isLoading,
  error,
  proposal
}) =>
  isLoading ? <LoadingPage /> : error ? <ErrorPage {...{ error }} /> : (
    <div class={style.proposalDetail}>
      <h2><Link href={`/proposals/${proposal.token}`}>{proposal.name}</Link></h2>
      <div>
        Created {(new Date(proposal.timestamp * 1000)).toString()}
      </div>
      <hr />
      <Markdown markup={proposal.description} />
    </div>
  );

export default ProposalPage;
