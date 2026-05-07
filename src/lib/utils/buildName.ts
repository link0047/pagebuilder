export function generateBuildName(pageType: string): string {
  const date = new Date().toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return `${pageType} - ${date}`;
}
