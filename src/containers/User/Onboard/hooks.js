import { useSelector } from "src/redux";
import * as sel from "src/selectors";

export const useUserOnboard = () => {
  const loginResponse = useSelector(sel.apiLoginResponse);
  return {
    firstUserAccess: !!loginResponse && !loginResponse.lastlogintime
  };
};
