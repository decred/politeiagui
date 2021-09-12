import { saveFileToMde } from "./helpers";

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

    for (const blob of items) {
      await saveFileToMde(blob, saveImage, initialState, textApi, l18n);
    }
  }
};

export default customSaveImageCommand;
