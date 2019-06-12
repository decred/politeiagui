import { useEffect, useState } from "react";
import * as sel from "src/selectors";
import * as act from "src/actions";
import { useRedux } from "src/redux";
import { useLoaderContext } from "src/Appv2/Loader";
import {
  getVoteTimeLeftInWords,
  isVoteActiveProposal,
  getVoteBlocksLeft
} from "./helpers";

const mapStateToProps = {
  lastBlockHeight: sel.lastBlockHeight,
  loadingBlockHeight: sel.isApiRequestingLastBlockHeight,
  error: sel.lasBlockHeightError
};

const mapDispatchToProps = {
  onFetchLastBlockHeight: act.getLastBlockHeight
};

export function useProposalVoteInfo(proposal) {
  const { lastBlockHeight, ...fromRedux } = useRedux(
    {},
    mapStateToProps,
    mapDispatchToProps
  );
  const { apiInfo } = useLoaderContext();
  const [voteActive, setVoteActive] = useState(false);
  const [voteTimeLeft, setVoteTimeLeft] = useState("");
  const [voteBlocksLeft, setBlocksLeft] = useState(null);

  function updateVoteTimeLeft() {
    const timeLeft = getVoteTimeLeftInWords(
      proposal,
      lastBlockHeight,
      apiInfo.testnet
    );
    setVoteTimeLeft(timeLeft);
  }

  function updateVoteBlocksLeft() {
    const blocksLeft = getVoteBlocksLeft(proposal, lastBlockHeight);
    setBlocksLeft(blocksLeft);
  }

  useEffect(() => {
    if (!lastBlockHeight && !fromRedux.loadingBlockHeight) {
      fromRedux.onFetchLastBlockHeight();
    }
  }, []);

  useEffect(() => {
    if (lastBlockHeight) {
      const isActive = isVoteActiveProposal(proposal);
      setVoteActive(isActive);

      if (isActive) {
        updateVoteTimeLeft();
        updateVoteBlocksLeft();
      }
    }
  }, [lastBlockHeight]);

  return {
    ...fromRedux,
    lastBlockHeight,
    voteActive,
    voteTimeLeft,
    voteBlocksLeft
  };
}
