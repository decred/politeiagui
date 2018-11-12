const dummyStorage = {};

// Config the localStorage backend, using options set in the config.
function _initStorage(options) {
  const self = this;

  const dbInfo = {};
  if (options) {
    for (const i in options) {
      dbInfo[i] = options[i];
    }
  }

  dummyStorage[dbInfo.name] = dbInfo.db = {};

  self._dbInfo = dbInfo;
  return Promise.resolve();
}

function clear(callback) {
  const self = this;
  const promise = new Promise(function(resolve, reject) {
    self
      .ready()
      .then(function() {
        const db = self._dbInfo.db;

        for (const key in db) {
          if (db.hasOwnProperty(key)) {
            delete db[key];
            // db[key] = undefined;
          }
        }

        resolve();
      })
      .catch(reject);
  });

  executeCallback(promise, callback);
  return promise;
}

function getItem(key, callback) {
  const self = this;

  // Cast the key to a string, as that's all we can set as a key.
  if (typeof key !== "string") {
    window.console.warn(key + " used as a key, but it is not a string.");
    key = String(key);
  }

  const promise = new Promise(function(resolve, reject) {
    self
      .ready()
      .then(function() {
        try {
          const db = self._dbInfo.db;
          const result = db[key];
          resolve(result);
        } catch (e) {
          reject(e);
        }
      })
      .catch(reject);
  });

  executeCallback(promise, callback);
  return promise;
}

function iterate(callback) {
  const self = this;

  const promise = new Promise(function(resolve, reject) {
    self
      .ready()
      .then(function() {
        try {
          const db = self._dbInfo.db;

          for (const key in db) {
            const result = db[key];
            callback(result, key);
          }

          resolve();
        } catch (e) {
          reject(e);
        }
      })
      .catch(reject);
  });

  executeCallback(promise, callback);
  return promise;
}

function key(n, callback) {
  const self = this;
  const promise = new Promise(function(resolve, reject) {
    self
      .ready()
      .then(function() {
        const db = self._dbInfo.db;
        let result = null;
        let index = 0;

        for (const key in db) {
          if (db.hasOwnProperty(key) && db[key] !== undefined) {
            if (n === index) {
              result = key;
              break;
            }
            index++;
          }
        }

        resolve(result);
      })
      .catch(reject);
  });

  executeCallback(promise, callback);
  return promise;
}

function keys(callback) {
  const self = this;
  const promise = new Promise(function(resolve, reject) {
    self
      .ready()
      .then(function() {
        const db = self._dbInfo.db;
        const keys = [];

        for (const key in db) {
          if (db.hasOwnProperty(key)) {
            keys.push(key);
          }
        }

        resolve(keys);
      })
      .catch(reject);
  });

  executeCallback(promise, callback);
  return promise;
}

function length(callback) {
  const self = this;
  const promise = new Promise(function(resolve, reject) {
    self
      .keys()
      .then(function(keys) {
        resolve(keys.length);
      })
      .catch(reject);
  });

  executeCallback(promise, callback);
  return promise;
}

function removeItem(key, callback) {
  const self = this;

  // Cast the key to a string, as that's all we can set as a key.
  if (typeof key !== "string") {
    window.console.warn(key + " used as a key, but it is not a string.");
    key = String(key);
  }

  const promise = new Promise(function(resolve, reject) {
    self
      .ready()
      .then(function() {
        const db = self._dbInfo.db;
        if (db.hasOwnProperty(key)) {
          delete db[key];
          // db[key] = undefined;
        }

        resolve();
      })
      .catch(reject);
  });

  executeCallback(promise, callback);
  return promise;
}

function setItem(key, value, callback) {
  const self = this;

  // Cast the key to a string, as that's all we can set as a key.
  if (typeof key !== "string") {
    window.console.warn(key + " used as a key, but it is not a string.");
    key = String(key);
  }

  const promise = new Promise(function(resolve, reject) {
    self
      .ready()
      .then(function() {
        // Convert undefined values to null.
        // https://github.com/mozilla/localForage/pull/42
        if (value === undefined) {
          value = null;
        }

        // Save the original value to pass to the callback.
        const originalValue = value;
        const db = self._dbInfo.db;
        db[key] = value;
        resolve(originalValue);
      })
      .catch(reject);
  });

  executeCallback(promise, callback);
  return promise;
}

function executeCallback(promise, callback) {
  if (callback) {
    promise.then(
      function(result) {
        callback(null, result);
      },
      function(error) {
        callback(error);
      }
    );
  }
}

const dummyStorageDriver = {
  _driver: "dummyStorageDriver",
  _initStorage: _initStorage,
  // _supports: function() { return true; }
  iterate: iterate,
  getItem: getItem,
  setItem: setItem,
  removeItem: removeItem,
  clear: clear,
  length: length,
  key: key,
  keys: keys
};

export default dummyStorageDriver;
