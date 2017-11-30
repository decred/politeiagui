/* The validation will return an object with the following shape
  { files: [file1, file2], validationErrors: ['message1', 'message2']}
*/
export const errorTypes = {
  MAX_SIZE: 'max_size',
  MAX_IMAGES: 'max_length'
}

export function validateFiles(files, policy) {
  const validation = {
    files,
    errors: []
  }
  const validatedMaxImages = validateMaxImages(validation, policy);
  const validatedMaxSize = validateMaxSize(validatedMaxImages, policy);
  return validatedMaxSize;
}

export function getFormattedFiles({ base64, fileList }) {
  return Array.from(fileList).map(({ name, size, type: mime }, idx) => ({
    name, mime, size, payload: base64[idx].split("base64,").pop()
  }))
}

export function isFileValid(file, policy) {
  if (file.size > policy.maximagesize) {
    return false;
  }

  if (policy.validmimetypes.indexOf(file.mime) < 0) {
    return false;
  }

  return true;
}

function getErrorMessage(policy, errorType, filename = '') {
  const errors = {
    [errorTypes.MAX_SIZE]: `The file ${filename} exceeds the maximum size`,
    [errorTypes.MAX_IMAGES]: `You can upload a maximum of ${policy.maximages} images per proposal`
  }
  return errors[errorType];
}

function validateMaxImages({errors, files}, policy) {
  if (files.length > policy.maximages) {
    errors.push(getErrorMessage(policy, errorTypes.MAX_IMAGES));
    return ({
      files: files.slice(0, policy.maximages - 1),
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
  })
  return ({
    files: newFiles,
    errors
  });
}
