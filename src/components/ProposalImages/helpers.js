export const errorTypes = {
  MAX_SIZE: "max_size",
  MAX_IMAGES: "max_length",
  INVALID_MIME: "invalid_mime"
};

/* The validation will return an object with the following shape
  { files: [file1, file2], validationErrors: ['message1', 'message2']}
*/
export function validateFiles(files, policy) {
  const validation = {
    files,
    errors: [],
    policy: policy
  };

  const validated = validatePipe(
    validateMaxImages,
    validateMaxSize,
    validateMimeTypes
  );

  return validated(validation, policy);
}

/*
  Format proposal files before sending to server. If the file extension
  is .txt, we correct its mime type to match the type that is found by
  the server
*/
export function getFormattedFiles({ base64, fileList }) {
  return Array.from(fileList).map(({ name, size, type: mime }, idx) => {
    return {
      name,
      mime: name.includes(".txt") ? `${mime}; charset=utf-8` : mime,
      size,
      payload: base64[idx].split("base64,").pop()
    };
  });
}

/*
  Receive Object: file and Object: policy and returns an Object with the
  bool: valid and string: errorMsg fields. Can be used to verify if a file is
  valid and to print the appropriate errorMsg
*/
export function isFileValid(file, policy) {
  if (file.size > policy.maximagesize) {
    return {
      valid: false,
      errorMsg: getErrorMessage(policy, errorTypes.MAX_SIZE, file.name)
    };
  }

  if (policy.validmimetypes.indexOf(file.mime) < 0) {
    return {
      valid: false,
      errorMsg: getErrorMessage(policy, errorTypes.INVALID_MIME, file.name)
    };
  }

  return {
    valid: true,
    errorMsg: null
  };
}

function getErrorMessage(policy, errorType, filename = "") {
  const errors = {
    [errorTypes.MAX_SIZE]: `The file "${filename}" exceeds the maximum size.`,
    [errorTypes.MAX_IMAGES]: `You can upload a maximum of ${
      policy.maximages
    } images per proposal.`,
    [errorTypes.INVALID_MIME]: `The file "${filename}" has an invalid MIME type.`
  };
  return errors[errorType];
}

const validatePipe = (...fs) => x => fs.reduce((v, f) => f(v), x);

function validateMaxImages({ files, errors, policy }) {
  if (files.length > policy.maximages) {
    errors.push(getErrorMessage(policy, errorTypes.MAX_IMAGES));
    return {
      files: files.slice(0, policy.maximages),
      errors
    };
  }
  return { files, errors, policy };
}

function validateMaxSize({ files, errors, policy }) {
  const newFiles = files.filter(file => {
    if (file.size > policy.maximagesize) {
      errors.push(getErrorMessage(policy, errorTypes.MAX_SIZE, file.name));
      return false;
    }
    return true;
  });
  return {
    files: newFiles,
    errors,
    policy
  };
}

function validateMimeTypes({ files, errors, policy }) {
  const newFiles = files.filter(file => {
    if (policy.validmimetypes.indexOf(file.mime) < 0) {
      errors.push(getErrorMessage(policy, errorTypes.INVALID_MIME, file.name));
      return false;
    }
    return true;
  });
  return {
    files: newFiles,
    errors
  };
}
