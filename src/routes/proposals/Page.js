import { h } from "preact";
import LoadingPage from "../../components/LoadingPage";
import ErrorPage from "../../components/ErrorPage";
import ProposalSummary from "./ProposalSummary";
import style from "./style";

const ProposalsPage = ({
  isLoading,
  proposals,
  error
}) =>
  isLoading ? <LoadingPage /> : error ? <ErrorPage {...{ error }} /> : (
    <article class={style.proposals}>
      <h2>Proposals</h2>
      <ol className={"proposals-list"}>
        {proposals.map(proposal => (
          <li className={"proposal"}>
            <ProposalSummary {...{ proposal }} />
          </li>
        ))}
      </ol>
    </article>
  );

export default ProposalsPage;
