export const basicAction = type =>
  (payload, error) => ({
    type,
    error: !!error,
    payload: error ? error : payload,
  });
