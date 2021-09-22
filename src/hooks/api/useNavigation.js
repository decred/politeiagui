import * as act from "src/actions";
import * as sel from "src/selectors";
import { useSelector, useAction } from "src/redux";

export default function useNavigation() {
  const user = useSelector(sel.currentUser);
  const isCMS = useSelector(sel.isCMS);
  const username = user && user.username;
  const onLogout = useAction(act.onLogout);
  return { user, username, onLogout, isCMS };
}
