/* 
This lib is designed to handle persisting data for the text editors
*/

const updateFormData = (store) => {
  const newProposalData = (store.getState().form["form/proposal"] && store.getState().form["form/proposal"].values) || {};
  const newCommentData = (store.getState().form["form/reply"] && store.getState().form["form/reply"].values) || {};
  const path = window.location.pathname;
  Object.keys(newProposalData).forEach(key =>
    sessionStorage.setItem(`new-proposal-${key}`, newProposalData[key])
  );
  Object.keys(newCommentData).forEach(key =>
    sessionStorage.setItem(`new-${key}::${path}`, newCommentData[key])
  );
};

export const getNewProposalData = () => {
  return {
    name: sessionStorage.getItem("new-proposal-name") || "",
    description: sessionStorage.getItem("new-proposal-description") || "",
  };
};

export const getNewCommentData = () => {
  const { pathname } = window.location;
  return {
    comment: sessionStorage.getItem(`new-comment::${pathname}`) || ""
  };
};

export const handleSaveState = (store) => {
  updateFormData(store);
};
