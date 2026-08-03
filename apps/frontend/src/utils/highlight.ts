export function highlightText(
  text: string,
  keyword: string
): string[] {
  if (!keyword) {
    return [text];
  }

  const regex = new RegExp(`(${keyword})`, "gi");

  return text.split(regex);
}