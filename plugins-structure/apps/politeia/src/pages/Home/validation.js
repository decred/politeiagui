export function validateInventoryIsLoaded(list) {
  if (!Array.isArray(list)) {
    const error = Error(
      "The inventory list is not loaded. Can not fetch next batch without an inventory list."
    );
    console.error(error);
    throw error;
  }
  return true;
}

export function validateInventoryListLength(list) {
  if (list.length === 0) {
    console.warn(
      "You tried to call fetchNextBatch with an empty inventory list. To prevent an unnecessary call to the backend the action was not fired."
    );
    return false;
  }
  return true;
}
