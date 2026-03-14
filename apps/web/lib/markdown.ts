export interface TocItem {
  id: string;
  text: string;
  level: number;
}

export function slugifyHeading(text: string) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[`~!@#$%^&*()+=<>?,./:;"'{}|\[\]\\]/g, "")
    .replace(/\s+/g, "-");
}

export function extractHeadings(markdown: string): TocItem[] {
  return markdown
    .split("\n")
    .filter((line) => /^#{1,6}\s/.test(line))
    .map((line) => {
      const [, hashes, text] = line.match(/^(#{1,6})\s+(.*)$/) ?? [];
      return {
        id: slugifyHeading(text),
        text,
        level: hashes.length
      };
    });
}
