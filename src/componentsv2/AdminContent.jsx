import { useLoaderContext } from "src/Appv2/Loader";
import PropTypes from "prop-types";

const AdminContent = ({ children, fallback }) => {
  const { initDone, currentUser } = useLoaderContext();
  const userIsAdmin = initDone && currentUser && currentUser.isadmin;
  return userIsAdmin ? children : fallback;
};

AdminContent.propTypes = {
  children: PropTypes.node,
  fallback: PropTypes.node
};

AdminContent.defaultProps = {
  fallback: null
};

export default AdminContent;
