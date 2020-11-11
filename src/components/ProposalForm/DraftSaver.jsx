import React, { useEffect, useState } from "react";
import { Button } from "pi-ui";
import { FormikConsumer } from "formik";
import { useDraftProposals } from "src/containers/Proposal/User/hooks";
import { getQueryStringValue, setQueryStringValue } from "src/lib/queryString";
import { getKeyByValue } from "src/helpers";
import {
  getMarkdownContent
} from "src/containers/Proposal/helpers";

/**
 * replaceBlobsByDigestsAndGetFiles uses a regex to parse images
 * @param {String} description the markdown description
 * @param {Map} map the map of blob -> file
 * @returns {object} { description, files }
 */
function replaceBlobsByDigestsAndGetFiles(description, map) {
  const imageRegexParser = /!\[[^\]]*\]\((?<blob>.*?)(?="|\))(?<optionalpart>".*")?\)/g;
  const imgs = description.matchAll(imageRegexParser);
  let newDescription = description;
  const files = [];
  /**
   * This for loop will update the newDescription replacing the image blobs by their digests and push the img object to an array of files
   * */
  for (const img of imgs) {
    const { blob } = img.groups;
    if (map.has(blob)) {
      newDescription = newDescription.replace(blob, map.get(blob).digest);
      files.push(map.get(blob));
    }
  }
  return { description: newDescription, files };
}

const b64toBlob = (b64Data, contentType = "", sliceSize = 512) => {
  const byteCharacters = atob(b64Data);
  const byteArrays = [];

  for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
    const slice = byteCharacters.slice(offset, offset + sliceSize);

    const byteNumbers = new Array(slice.length);
    for (let i = 0; i < slice.length; i++) {
      byteNumbers[i] = slice.charCodeAt(i);
    }

    const byteArray = new Uint8Array(byteNumbers);
    byteArrays.push(byteArray);
  }

  const blob = new Blob(byteArrays, { type: contentType });
  return blob;
};

function replaceImgDigestByBlob(vals, mapBlobToFile) {
  if (!vals) return { text: "", markdownFiles: [] };
  const { description, files } = vals;
  const imageRegexParser = /!\[[^\]]*\]\((?<digest>.*?)(?="|\))(?<optionalpart>".*")?\)/g;
  const imgs = description.matchAll(imageRegexParser);
  let newText = description;
  const markdownFiles = [];
  /**
   * This for loop will update the newText replacing images digest by a blob and push the img object to an array of markdownFiles
   * */
  for (const img of imgs) {
    const { digest } = img.groups;
    const obj = getKeyByValue(files, digest);
    if (obj) {
      const urlCreator = window.URL || window.webkitURL;
      const blobUrl = urlCreator.createObjectURL(b64toBlob(obj.payload, obj.mime));
      mapBlobToFile.set(blobUrl, obj);
      markdownFiles.push(obj);
      newText = newText.replace(digest, blobUrl);
    }
  }
  return { text: newText, markdownFiles };
}


const DraftSaver = ({ values, setValues, dirty, submitSuccess, mapBlobToFile }) => {
  const [draftId, setDraftId] = useState(getQueryStringValue("draft"));
  const {
    draftProposals,
    onDeleteDraftProposal: onDelete,
    onSaveDraftProposal: onSave
  } = useDraftProposals();
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const canSaveDraft = values && !!values.name && !saved;

  const executeFakeLoading = () => {
    setSaving(true);
    setTimeout(() => {
      setSaved(true);
      setSaving(false);
    }, 300);
  };

  const handleSave = () => {
    const { description, files } = replaceBlobsByDigestsAndGetFiles(
      values.description,
      mapBlobToFile
    );
    const newFiles = [...values.files, ...files];

    const id = onSave({ draftId, ...values, files: newFiles, description });
    // first time saving this draft
    if (!draftId) {
      setDraftId(id);
    }
    executeFakeLoading();
  };

  useEffect(
    function updateURLForDraftID() {
      if (draftId) {
        setQueryStringValue("draft", draftId);
      }
    },
    [draftId]
  );

  useEffect(
    function resetSaved() {
      setSaved(false);
    },
    [values, setSaved]
  );

  useEffect(
    function handleSubmitSuccess() {
      if (submitSuccess && !!draftId) {
        onDelete(draftId);
      }
    },
    [submitSuccess, draftId, onDelete]
  );

  useEffect(
    function handleInitializeFormFromDraft() {
      const foundDraftProposal =
        !!draftProposals && draftId && draftProposals[draftId];
      if (foundDraftProposal && !dirty) {
        const {
          name,
          files,
          type,
          description,
          rfpDeadline,
          rfpLink
        } = foundDraftProposal;
        const { text, markdownFiles } = replaceImgDigestByBlob({ description, files }, mapBlobToFile);
        setValues({ name, description: text, files: files.filter((file) => !markdownFiles.includes(file)), type, rfpDeadline, rfpLink });
      }
    },
    [draftProposals, dirty, draftId, setValues, mapBlobToFile]
  );
  return (
    <Button
      type="button"
      kind={saving || !canSaveDraft ? "disabled" : "secondary"}
      loading={saving}
      onClick={handleSave}>
      {saved ? "Saved ✓" : "Save Draft"}
    </Button>
  );
};

const Wrapper = (props) => {
  return (
    <FormikConsumer>
      {(formikProps) => {
        return <DraftSaver {...{ ...props, ...formikProps }} />;
      }}
    </FormikConsumer>
  );
};

export default Wrapper;
