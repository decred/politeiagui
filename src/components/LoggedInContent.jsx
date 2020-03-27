import { useLoaderContext } from "src/containers/Loader";
import PropTypes from "prop-types";

const LoggedInContent = ({ children, fallback }) => {
  const { initDone, currentUser } = useLoaderContext();
  const userLoggedIn = initDone && currentUser;
  return userLoggedIn ? children : fallback;
};

LoggedInContent.propTypes = {
  children: PropTypes.node,
  fallback: PropTypes.node
};

LoggedInContent.defaultProps = {
  fallback: null
};

export default LoggedInContent;
