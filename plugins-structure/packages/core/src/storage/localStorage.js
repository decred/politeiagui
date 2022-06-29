export const storageKey = "politeiagui-storage";
export const userStorageKey = (uuid) => `${uuid}-${storageKey}`;

export function getKey(key, uuid) {
  return `${uuid ? userStorageKey(uuid) : storageKey}-${key}`;
}

export function getFromLocalStorage(key, uuid) {
  try {
    const item = localStorage.getItem(getKey(key, uuid));
    if (!item) return undefined;
    else return JSON.parse(item);
  } catch (err) {
    return undefined;
  }
}

export function saveToLocalStorage(key, value, uuid) {
  try {
    const lsKey = getKey(key, uuid);
    localStorage.setItem(lsKey, JSON.stringify(value));
  } catch (error) {
    console.error(error);
  }
}
