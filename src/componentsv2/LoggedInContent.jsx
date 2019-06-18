import { useLoaderContext } from "src/Appv2/Loader";

const LoggedInContent = ({ children }) => {
  const { initDone, currentUser } = useLoaderContext();
  const userLoggedIn = initDone && currentUser;
  return userLoggedIn ? children : null;
};

export default LoggedInContent;
