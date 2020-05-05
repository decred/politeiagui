import * as act from "src/actions";
import { useAction } from "src/redux";
import useUserDetail from "src/hooks/api/useUserDetail";
import { isUserDeveloper } from "src/containers/DCC";
import isEmpty from "lodash/isEmpty";

export default function useContractor(userID) {
  const onUpdateDccInfo = useAction(act.onManageCmsUser);
  const onUpdateContractorInfo = useAction(act.onEditCmsUser);
  const { user, isAdmin, loading } = useUserDetail(userID);
  const isDeveloper = isUserDeveloper(user);
  const requireGitHubName = isUserDeveloper(user) && isEmpty(user.githubname);

  return {
    onUpdateDccInfo,
    onUpdateContractorInfo,
    user,
    isAdmin,
    isDeveloper,
    requireGitHubName,
    loading
  };
}
