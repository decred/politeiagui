export function isFileValid(file, policy) {
  if (file.size > policy.maximagesize) {
    return false;
  }

  if (policy.validmimetypes.indexOf(file.mime) !== -1) {
    return false;
  }

  return true;
}
