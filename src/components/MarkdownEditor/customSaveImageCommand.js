function getBreaksNeededForEmptyLineBefore(text = "", startPosition = 0) {
  if (startPosition === 0) return 0;

  // - If we're in the first line, no breaks are needed
  // - Otherwise there must be 2 breaks before the previous character.

  // Depending on how many breaks exist already, we may need to insert 0, 1 or 2 breaks
  let neededBreaks = 2;
  let isInFirstLine = true;
  for (let i = startPosition - 1; i >= 0 && neededBreaks >= 0; i--) {
    switch (text.charCodeAt(i)) {
      case 32: // blank space
        continue;
      case 10: // line break
        neededBreaks--;
        isInFirstLine = false;
        break;
      default:
        return neededBreaks;
    }
  }
  return isInFirstLine ? 0 : neededBreaks;
}

export function readFileAsync(file, as = "arrayBuffer") {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      if (typeof reader.result === "string" && as !== "binary") {
        throw new Error("reader.result is expected to be an ArrayBuffer");
      }
      if (typeof reader.result !== "string" && as === "binary") {
        throw new Error("reader.result is expected to be an BinaryString");
      }
      resolve([reader.result, file]);
    };

    reader.onerror = reject;

    if (as === "binary") {
      reader.readAsBinaryString(file);
    } else {
      reader.readAsArrayBuffer(file);
    }
  });
}

function dataTransferToArray(items) {
  const result = [];
  for (const index in items) {
    const item = items[index];
    if (item.kind === "file") {
      result.push(item.getAsFile());
    }
  }
  return result;
}

function fileListToArray(list) {
  const result = [];
  for (let i = 0; i < list.length; i++) {
    result.push(list[0]);
  }
  return result;
}

const isPasteEvent = (context) => context.event.clipboardData !== undefined;

const isDragEvent = (context) => context.event.dataTransfer !== undefined;

const customSaveImageCommand = {
  async execute({ initialState, textApi, context, l18n }) {
    if (!context) {
      throw new Error("wrong context");
    }
    const pasteContext = context;
    const { event, saveImage } = pasteContext;

    const items = isPasteEvent(context)
      ? dataTransferToArray(event.clipboardData.items)
      : isDragEvent(context)
      ? dataTransferToArray(event.dataTransfer.items)
      : fileListToArray(event.target.files);

    for (const index in items) {
      const breaksBeforeCount = getBreaksNeededForEmptyLineBefore(
        initialState.text,
        initialState.selection.start
      );
      const breaksBefore = Array(breaksBeforeCount + 1).join("\n");

      const placeHolder = `${breaksBefore}![${l18n.uploadingImage}]()`;

      textApi.replaceSelection(placeHolder);

      const blob = items[index];
      // this is the format we have to send to the server
      const serverImage = await readFileAsync(blob, "binary");
      // this is the format we have can show a blob
      const displayImage = await readFileAsync(blob);
      const image = await saveImage({ serverImage, displayImage });
      const newState = textApi.getState();

      const uploadingText = newState.text.substr(
        initialState.selection.start,
        placeHolder.length
      );

      if (uploadingText === placeHolder) {
        // In this case, the user did not touch the placeholder. Good user
        // we will replace it with the real one that came from the server
        textApi.setSelectionRange({
          start: initialState.selection.start,
          end: initialState.selection.start + placeHolder.length
        });

        const realImageMarkdown = `${breaksBefore}![${image.name}](${image.url})`;

        const selectionDelta = realImageMarkdown.length - placeHolder.length;

        textApi.replaceSelection(realImageMarkdown);
        textApi.setSelectionRange({
          start: newState.selection.start + selectionDelta,
          end: newState.selection.end + selectionDelta
        });
      }
    }
  }
};

export default customSaveImageCommand;
