const canvas = document.createElement("canvas");
const ctx = canvas.getContext("2d");
const SAMPLE_HEIGHT = 40;

export function sampleImageLuminance(image: HTMLImageElement): "light" | "dark" {
  if (!ctx || image.naturalHeight === 0) return "light";

  const { naturalWidth, naturalHeight } = image;

  canvas.width = naturalWidth;
  canvas.height = SAMPLE_HEIGHT;

  ctx?.drawImage(
    image,
    0, naturalHeight - SAMPLE_HEIGHT,
    naturalWidth, SAMPLE_HEIGHT,
    0, 0,
    naturalWidth, SAMPLE_HEIGHT
  );

  const imageData = ctx?.getImageData(0, 0, canvas.width, SAMPLE_HEIGHT);
  if (!imageData) return "light";

  const { data } = imageData;
  const pixelCount = data.length / 4;

  let luminanceSum = 0;

  for (let i = 0; i < data.length; i += 4) {
    const r = data[i] / 255;
    const g = data[i + 1] / 255;
    const b = data[i + 2] / 255;
    luminanceSum += 0.2126 * r + 0.7152 * g + 0.0722 * b;
  }

  const averageLuminance = luminanceSum / pixelCount;
  return averageLuminance > 0.5 ? "dark" : "light";
}
