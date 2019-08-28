import { useEffect } from "react";
import * as sel from "src/selectors";
import * as act from "src/actions";
import { useRedux } from "src/redux";

const mapStateToProps = {
  loading: sel.apiTokenInventoryIsRequesting,
  error: sel.apiTokenInventoryError,
  tokenInventory: sel.apiTokenInventoryResponse
};

const mapDispatchToProps = {
  onFetchTokenInventory: act.onFetchTokenInventory
};

export default function useTokenInventory(ownProps) {
  const { onFetchTokenInventory, tokenInventory, error, loading } = useRedux(
    ownProps,
    mapStateToProps,
    mapDispatchToProps
  );

  useEffect(() => {
    onFetchTokenInventory();
  }, [onFetchTokenInventory]);

  return [tokenInventory, error, loading];
}
