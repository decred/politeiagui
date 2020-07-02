import React, { useCallback, useState } from "react";
import SelectEditor from "./components/SelectEditor";
import TextArea from "./components/TextArea";
import {
  multilineCellValue,
  textWrapper,
  highlightChar
} from "./InvoiceDatasheet.module.css";
import { buildSimpleMatchRegexFromSupportedChars } from "src/utils/validation";
import LazySelector from "./components/LazySelector";
import { isEmpty } from "src/helpers";
import { Spinner } from "pi-ui";
import useApprovedProposals from "src/hooks/api/useApprovedProposals";
import { getProposalsOptions } from "./helpers";
import drop from "lodash/drop";
import take from "lodash/take";

const PROPOSAL_PAGE_SIZE = 20;

export const selectWrapper = (options) => (props) => (
  <SelectEditor {...{ ...props, options }} />
);

export const textAreaWrapper = () => (props) => (
  <div className={textWrapper}>
    <TextArea {...props} />
  </div>
);

const printHighlightingUnsupported = (uniqueUnmatched, value, isMultiline) => {
  return (
    <div className={isMultiline ? multilineCellValue : ""}>
      {value
        .split("")
        .map((v) =>
          uniqueUnmatched.has(v) ? (
            <span className={highlightChar}>{v}</span>
          ) : (
            v
          )
        )}
    </div>
  );
};

const getUnmatchedSet = (supportedChars, value) => {
  const re = buildSimpleMatchRegexFromSupportedChars(supportedChars);
  const unmatched = value.replace(re, "");
  const uniqueUnmatched = new Set(unmatched);
  return uniqueUnmatched;
};

export const multilineTextWrapper = (supportedChars) => ({ value }) => {
  const uniqueUnmatched = getUnmatchedSet(supportedChars, value);
  return printHighlightingUnsupported(uniqueUnmatched, value, true);
};

export const singlelineTextWrapper = (supportedChars) => ({ value }) => {
  const uniqueUnmatched = getUnmatchedSet(supportedChars, value);
  return printHighlightingUnsupported(uniqueUnmatched, value, false);
};

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
