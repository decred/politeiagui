export const basicAction = type =>
  (payload, error, meta) => ({
    type,
    error: !!error,
    meta,
    payload: error ? error : payload,
  });
