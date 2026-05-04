export function parsePrice(text: string): number {
  return parseFloat(
    text.replace(',', '.').replace(/[^\d.]/g, '')
  );
}
