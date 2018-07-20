/* The validation will return an object with the following shape
  { files: [file1, file2], validationErrors: ['message1', 'message2']}
*/
export const errorTypes = {
  MAX_SIZE: "max_size",
  MAX_IMAGES: "max_length",
  INVALID_MIME: "invalid_mime"
};

export function validateFiles(files, policy) {
  const validation = {
    files,
    errors: []
  };
  const validatedMaxImages = validateMaxImages(validation, policy);
  const validatedMaxSize = validateMaxSize(validatedMaxImages, policy);
  return validatedMaxSize;
}

export function getFormattedFiles({ base64, fileList }) {
  return Array.from(fileList).sort((a, b) => a.size - b.size).map(({ name, size, type: mime }, idx) => ({
    name, mime, size, payload: base64[idx].split("base64,").pop()
  }));
}

/*
  Receive Object: file and Object: policy and returns an Object with the
  bool: valid and string: errorMsg fields. Can be used to verify if a file is
  valid and to print the appropriate errorMsg
*/
export function isFileValid(file, policy) {
  if (file.size > policy.maximagesize) {
    return ({
      valid: false,
      errorMsg: getErrorMessage(policy, errorTypes.MAX_SIZE, file.name)
    });
  }

  if (policy.validmimetypes.indexOf(file.mime) < 0) {
    return ({
      valid: false,
      errorMsg: getErrorMessage(policy, errorTypes.INVALID_MIME, file.name)
    });
  }

  return ({
    valid: true,
    errorMsg: null
  });
}


function getErrorMessage(policy, errorType, filename = "") {
  const errors = {
    [errorTypes.MAX_SIZE]: `The file "${filename}" exceeds the maximum size.`,
    [errorTypes.MAX_IMAGES]: `You can upload a maximum of ${policy.maximages} images per proposal.`,
    [errorTypes.INVALID_MIME]: `The file "${filename}" has an invalid mime type.`
  };
  return errors[errorType];
}

function validateMaxImages({errors, files}, policy) {
  if (files.length > policy.maximages) {
    errors.push(getErrorMessage(policy, errorTypes.MAX_IMAGES));
    return ({
      files: files.slice(0, policy.maximages),
      errors
    });
  }
  return ({errors, files});
}

function validateMaxSize({errors, files}, policy) {
  const newFiles = files.filter(file => {
    if (file.size > policy.maximagesize) {
      errors.push(getErrorMessage(policy, errorTypes.MAX_SIZE, file.name));
      return false;
    }
    return true;
  });
  return ({
    files: newFiles,
    errors
  });
}
