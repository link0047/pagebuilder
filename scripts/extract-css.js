import { readFile, writeFile, mkdir } from "node:fs/promises";
import { join } from "node:path";
import browserslist from "browserslist";
import { transform, browserslistToTargets } from "lightningcss";

const OUTPUT_DIR = "src/styles/generated";
const OUTPUT_FILE = "preview-styles.css";

const COMPONENT_FILES = [
  "Hero",
  "Heading",
  "Text",
  "OfferCallout",
  "Link",
  "Badge",
  "CTAGroup",
  "EditorialBlock",
  "EditorialCard",
  "CollectionBlock",
  "CollectionBlockItem",
  "FeaturedCategories",
  "FeaturedCategory",
  "RecommendationBlock",
  "BlockSection",
  "Card",
  "ProductCard",
  "Image",
  "Page",
].map((name) => `src/lib/components/${name}.svelte`);

async function attempt(promise) {
  try {
    const result = await promise;
    return [null, result];
  } catch (error) {
    return [error, null];
  }
}

async function extractCSSFromFiles(files) {
  let extractedCSS = "";

  for (const file of files) {
    const [error, content] = await attempt(readFile(file, "utf-8"));

    if (error) {
      console.warn(`Failed to read ${file}:`, error.message);
      continue;
    }

    const stylePattern = /<style(?:\s[^>]*)?>([\s\S]*?)<\/style>/g;
    let match;
    while ((match = stylePattern.exec(content)) !== null) {
      if (match[1]?.trim()) {
        let css = match[1].trim();

        // 1. Strip :global() but keep the content inside
        // Example: :global(.class) -> .class
        // Example: :global(*) -> *
        css = css.replace(/:global\((.*?)\)/g, "$1");

        extractedCSS += `${css}\n`;
      }
    }
  }

  return extractedCSS;
}

async function main() {
  console.log(`Processing ${COMPONENT_FILES.length} component files`);

  const [error, extractedCSS] = await attempt(extractCSSFromFiles(COMPONENT_FILES));

  if (error) {
    console.error("Failed to extract CSS", error.message);
    process.exit(1);
  }

  if (!extractedCSS?.trim()) {
    console.log("No CSS found in the specified files");
    return;
  }

  const [writeError] = await attempt(mkdir(OUTPUT_DIR, { recursive: true }));

  if (writeError) {
    console.error("Failed to create output directory:", writeError.message);
    process.exit(1);
  }

  const targets = browserslistToTargets(browserslist("last 2 years, not dead"));
  const [transformError, result] = await attempt(
    Promise.resolve(
      transform({
        code: Buffer.from(extractedCSS),
        minify: true,
        targets,
        drafts: {
          nesting: true
        },
        errorRecovery: true
      })
    )
  );

  if (transformError) {
    console.warn("Failed to transform CSS with lightningcss:", transformError.message);
    console.log("Saving unprocessed CSS instead...");
  }


  const finalCSS = result ? result.code.toString() : extractedCSS;
  const outputPath = join(OUTPUT_DIR, OUTPUT_FILE);
  const [saveError] = await attempt(writeFile(outputPath, finalCSS));

  if (saveError) {
    console.error("Failed to save CSS:", saveError.message);
    process.exit(1);
  }

  console.log("CSS extraction completed!");
  console.log(`Total CSS: ${extractedCSS.length} characters`);

  if (result) {
    console.log(`Minified CSS: ${result.code.length} characters`);
    console.log("CSS has been minified and optimized with lightningcss");
  }
}

main();
