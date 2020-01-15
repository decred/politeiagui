import * as Yup from "yup";

/**
 * Add method 'maxByteSize' for files size validation
 */
Yup.addMethod(Yup.number, "maxByteSize", (bytesSize) => {
  return Yup.mixed().test({
    name: "maxByteSize",
    test: (value) => value <= bytesSize,
    message: `File size must be less or equal than ${bytesSize / 1024}kb`
  });
});

/**
 * Add method "files" for validating a set of files based
 * on max size, maz number of files and valid mime types
 */
Yup.addMethod(
  Yup.array,
  "files",
  (maxSizeInBytes, maxFiles, validMimeTypes) => {
    return Yup.array()
      .of(
        Yup.object().shape({
          name: Yup.string(),
          mime: Yup.string().oneOf(validMimeTypes),
          payload: Yup.string(),
          size: Yup.number().maxByteSize(maxSizeInBytes)
        })
      )
      .max(maxFiles);
  }
);
