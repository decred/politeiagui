export function getMarkdownSection(text = "", header = "") {
  const headerMark = header.match(/^#+/g)[0];
  const [, sectionStart] = text?.split(header);
  const [section] = sectionStart.split(headerMark);
  return section;
}
