const INLINE_BASE64 = /^data:image\/.*;base64,/i;
const INLINE_IMG = /^data:image\/.*/i;

const isInlineImage = (src: string): boolean => INLINE_IMG.test(src);
const isInlineBase64Image = (src: string): boolean => INLINE_BASE64.test(src);
const isSameOrigin = (src: string): boolean => new URL(src).origin === window.location.origin;

const createPlaceholder = (width: number, height: number): string => {
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (ctx) {
    ctx.fillStyle = "#D3D3D3";
    ctx.fillRect(0, 0, width, height);
  }
  return canvas.toDataURL();
};

const fetchImageAsBase64 = async (src: string): Promise<string> => {
  const fetchWithCORS = async (): Promise<string> => {
    const response = await fetch(src, { mode: "cors" });
    const blob = await response.blob();
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  };

  const fetchWithoutCORS = async (): Promise<string> => {
    const response = await fetch(src, { mode: "no-cors" });
    const blob = await response.blob();
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  };

  try {
    return await fetchWithCORS();
  } catch {
    return await fetchWithoutCORS();
  }
};

export async function inlineImages(element: HTMLElement): Promise<void> {
  const images = Array.from(element.querySelectorAll("img"));

  await Promise.all(
    images.map(async (img) => {
      const src = img.getAttribute("src");

      if (!src || isInlineBase64Image(src) || isInlineImage(src) || isSameOrigin(src)) {
        return;
      }

      const width = img.offsetWidth;
      const height = img.offsetHeight;
      const placeholder = createPlaceholder(width, height);

      try {
        img.src = await fetchImageAsBase64(src);
      } catch {
        img.src = placeholder;
      }
    })
  );
}
