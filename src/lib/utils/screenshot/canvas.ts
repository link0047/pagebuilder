import { createForeignObjectSVG, loadSerializedSVG } from "./detect";

export type CaptureResult = {
  canvas: HTMLCanvasElement;
  toDataURL: (type?: string, quality?: number) => string;
};

export const toBlob = (canvas: HTMLCanvasElement): Promise<Blob> =>
  new Promise((resolve, reject) =>
    canvas.toBlob(
      (blob) => blob ? resolve(blob) : reject(new Error("Failed to create blob")),
      "image/png"
    )
  );

async function fetchImageAsBase64(src: string): Promise<string> {
  const proxyUrl = `/api/image-proxy?url=${encodeURIComponent(src)}`;
  const response = await fetch(proxyUrl);
  const blob = await response.blob();
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
};

export async function capture(element: HTMLElement): Promise<CaptureResult> {
  const { width, height } = element.getBoundingClientRect();
  const scale = 1;

  const iframe = element.querySelector("iframe");
  const iframeDoc = iframe?.contentDocument;
  const contentWidth = iframeDoc?.documentElement.scrollWidth ?? width;

  // measure natural height of clone without iframe constraints
  let contentHeight = iframeDoc?.documentElement.scrollHeight ?? height;
  if (iframeDoc) {
    const probe = document.createElement("div");
    probe.style.cssText = `position:fixed;top:-9999px;left:-9999px;width:${contentWidth}px;visibility:hidden;`;
    probe.appendChild(iframeDoc.documentElement.cloneNode(true));
    document.body.appendChild(probe);
    await new Promise(resolve => requestAnimationFrame(resolve));
    contentHeight = Math.max(contentHeight, probe.scrollHeight);
    document.body.removeChild(probe);
  }

  const canvas = document.createElement("canvas");
  canvas.width = Math.floor(contentWidth * scale);
  canvas.height = Math.floor(contentHeight * scale);

  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  if (!ctx) throw new Error("Could not get canvas context");

  ctx.scale(scale, scale);
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, contentWidth, contentHeight);

  if (iframe && iframeDoc) {
    const iframeCanvas = document.createElement("canvas");
    iframeCanvas.width = Math.floor(contentWidth * scale);
    iframeCanvas.height = Math.floor(contentHeight * scale);

    const iframeCtx = iframeCanvas.getContext("2d", { willReadFrequently: true });
    if (iframeCtx) {
      iframeCtx.scale(scale, scale);
      iframeCtx.fillStyle = "#ffffff";
      iframeCtx.fillRect(0, 0, contentWidth, contentHeight);

      const iframeClone = iframeDoc.documentElement.cloneNode(true) as HTMLElement;

      const base = document.createElement("base");
      base.href = window.location.origin;
      const head = iframeClone.querySelector("head");
      if (head) head.insertBefore(base, head.firstChild);

      // replace picture elements with correct desktop source
      const pictures = Array.from(iframeClone.querySelectorAll("picture"));
      pictures.forEach((picture) => {
        const img = picture.querySelector("img");
        if (!img) return;

        const sources = Array.from(picture.querySelectorAll("source"));
        const desktopSource = sources.find(s => s.media?.includes("min-width")) ?? sources[sources.length - 1];

        if (desktopSource) {
          const srcset = desktopSource.getAttribute("srcset");
          if (srcset) {
            const firstSrc = srcset.split(",")[0].trim().split(" ")[0];
            img.setAttribute("src", firstSrc);
          }
        }

        picture.replaceWith(img);
      });

      // inline all images as base64
      const images = Array.from(iframeClone.querySelectorAll("img"));
      await Promise.all(images.map(async (img) => {
        const src = img.getAttribute("src");
        if (!src || src.startsWith("data:")) return;
        try {
          const base64 = await fetchImageAsBase64(src);
          img.setAttribute("src", base64);
        } catch {
          const w = parseInt(img.getAttribute("width") ?? "100");
          const h = parseInt(img.getAttribute("height") ?? "100");
          const placeholder = document.createElement("canvas");
          placeholder.width = w;
          placeholder.height = h;
          const pCtx = placeholder.getContext("2d");
          if (pCtx) {
            pCtx.fillStyle = "#D3D3D3";
            pCtx.fillRect(0, 0, w, h);
          }
          img.setAttribute("src", placeholder.toDataURL());
        }
      }));

      const svg = createForeignObjectSVG(contentWidth, contentHeight, 0, 0, iframeClone);
      const img = await loadSerializedSVG(svg);
      iframeCtx.drawImage(img, 0, 0);
      ctx.drawImage(iframeCanvas, 0, 0);
    }
  }

  return {
    canvas,
    toDataURL: (type = "image/png", quality?: number) => canvas.toDataURL(type, quality),
  };
}
