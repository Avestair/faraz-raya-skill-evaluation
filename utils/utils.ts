export function truncateString(text: string, maxLength: number): string {
  if (text.length <= maxLength) {
    return text;
  }
  return text.slice(0, maxLength) + "...";
}

export function formatDate(unformattedDate: string) {
  const date = new Date(unformattedDate);
  return date.toLocaleDateString();
}
