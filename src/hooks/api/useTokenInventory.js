import { useEffect } from "react";
import * as sel from "src/selectors";
import * as act from "src/actions";
import { useRedux } from "src/redux";
import { useLoaderContext } from "src/Appv2/Loader";

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

  const { currentUser } = useLoaderContext();
  const userIsAdmin = currentUser && currentUser.isadmin;

  useEffect(() => {
    if (!tokenInventory) {
      onFetchTokenInventory();
    }
  }, [tokenInventory, onFetchTokenInventory]);

  useEffect(() => {
    if (userIsAdmin) {
      onFetchTokenInventory();
    }
  }, [userIsAdmin]);

  return [tokenInventory, error, loading];
}
