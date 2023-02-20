import {
  importKey,
  loadKey,
  selectIdentityError,
  selectIdentityIsValid,
  selectIdentityStatus,
  updateKey,
} from "./userIdentitySlice";

export const userIdentity = {
  update: updateKey,
  import: importKey,
  load: loadKey,
  selectError: selectIdentityError,
  selectIsValid: selectIdentityIsValid,
  selectStatus: selectIdentityStatus,
};
