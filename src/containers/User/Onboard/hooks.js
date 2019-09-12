import { useRedux } from "src/redux";
import * as sel from "src/selectors";

const mapStateToProps = {
  loginResponse: sel.apiLoginResponse
};

export const useUserOnboard = () => {
  const { loginResponse } = useRedux({}, mapStateToProps, {});
  return {
    firstUserAccess: !!loginResponse && !loginResponse.lastlogintime
  };
};
