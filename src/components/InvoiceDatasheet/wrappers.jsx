import React, { useCallback, useState } from "react";
import SelectEditor from "./components/SelectEditor";
import TextArea from "./components/TextArea";
import LazySelector from "./components/LazySelector";
import { getProposalsOptions } from "./helpers";
import { isEmpty } from "src/helpers";
import { Spinner } from "pi-ui";
import useApprovedProposals from "src/hooks/api/useApprovedProposals";
import drop from "lodash/drop";
import take from "lodash/take";

import { multilineCellValue, textWrapper } from "./InvoiceDatasheet.module.css";

const PROPOSAL_PAGE_SIZE = 20;

export const selectWrapper = (options) => (props) => (
  <SelectEditor {...{ ...props, options }} />
);

export const textAreaWrapper = () => (props) => (
  <div className={textWrapper}>
    <TextArea {...props} />
  </div>
);

export const multilineTextWrapper = () => ({ value }) => (
  <div className={multilineCellValue}>{value}</div>
);

export const proposalViewWrapper = (proposals) => ({ cell: { value } }) => {
  const findProposal = useCallback(
    (v) => proposals && proposals.find((p) => p.value === v),
    []
  );

  const selectedProposal = findProposal(value);

  return (
    <>
      {!isEmpty(value) && !selectedProposal && <Spinner invert />}
      <span>{selectedProposal && selectedProposal.label}</span>
    </>
  );
};

export const proposalSelectWrapper = (initialOptions) => (props) => {
  const {
    proposals,
    proposalsTokens,
    onFetchProposalsBatch
  } = useApprovedProposals();

  const [needsFetch, setNeedsFetch] = useState(
    proposalsTokens.length > proposals.length
  );
  const [loading, setLoading] = useState(false);

  const [options, setOptions] = useState(initialOptions);

  const fetchProposalsBatch = useCallback(async () => {
    const remainingTokens = drop(proposalsTokens, options.length);
    const tokenParams = take(remainingTokens, PROPOSAL_PAGE_SIZE);
    setLoading(true);
    const res = await onFetchProposalsBatch(tokenParams, false);
    const fetchedProposals = res && res[0];
    setNeedsFetch(remainingTokens.length - fetchedProposals.length > 0);
    setLoading(false);
    const newOptions = [...options, ...getProposalsOptions(fetchedProposals)];
    setOptions(newOptions);
    return;
  }, [proposalsTokens, onFetchProposalsBatch, options, setOptions]);

  return (
    <>
      {!loading && (
        <LazySelector
          options={options}
          onFetch={fetchProposalsBatch}
          needsFetch={needsFetch}
          {...props}
        />
      )}
      {loading && (
        <div className="margin-top-s">
          <Spinner invert />
        </div>
      )}
    </>
  );
};
