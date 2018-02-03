const log = function(message, callback) {
  this.perform(() => {
    console.log(message);
  });

  if (typeof callback === "function") {
    callback.call(this);
  }

  return this;
};

export { log as command };
