import { readFile, writeFile, mkdir } from "node:fs/promises";
import { join } from "node:path";
import { transform } from "lightningcss";

const OUTPUT_DIR = "src/styles/generated";
const OUTPUT_FILE = "preview-styles.css";

async function attempt(promise) {
  try {
    const result = await promise;
    return [null, result];
  } catch (error) {
    return [error, null];
  }
}

async function extractCSSFromFiles(files) {
  let extractedCSS = `
  .page {
    width: 100%;
    max-width: 1200px;
    margin: 0 auto;
		font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji";
		background-color: #fff;
  	direction: ltr;
		display: flex;
		flex-flow: column nowrap;
		gap: 2rem;
		padding-inline: .5rem;
	}`;

  for (const file of files) {
    const [error, content] = await attempt(readFile(file, "utf-8"));

    if (error) {
      console.warn(`Failed to read ${file}:`, error.message);
      continue;
    }

    const match = /<style>([\s\S]*?)<\/style>/.exec(content);

    if (match && match[1]) {
      extractedCSS += match[1].trim();
    }
  }

  return extractedCSS;
}

async function main() {
  const svelteFiles = [
    "src/lib/components/Hero.svelte",
    "src/lib/components/Card.svelte",
    "src/lib/components/FeaturedCategories.svelte",
    "src/lib/components/FeaturedCategory.svelte",
    "src/lib/components/StoryBlock.svelte",
    "src/lib/components/CollectionBlock.svelte",
    "src/lib/components/ProductCard.svelte",
    "src/lib/components/StoryCard.svelte",
    "src/lib/components/HeroCTA.svelte",
    "src/lib/components/Image.svelte",
    "src/lib/components/PromoBadge.svelte"
  ];

  const [error, extractedCSS] = await attempt(extractCSSFromFiles(svelteFiles));

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

  const [transformError, result] = await attempt(
    Promise.resolve(
      transform({
        code: Buffer.from(extractedCSS),
        minify: true,
        targets: {
          // Target modern browsers
          chrome: 90 << 16,
          firefox: 88 << 16,
          safari: 14 << 16,
        },
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
    console.log("CSS has been minified and optimized with lightningcss");
  }
}

main();