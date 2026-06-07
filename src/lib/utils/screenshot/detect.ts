export function createForeignObjectSVG(
  width: number,
  height: number,
  x: number,
  y: number,
  node: Node
): SVGSVGElement {
  const xmlns = "http://www.w3.org/2000/svg";
  const svg = document.createElementNS(xmlns, "svg");
  const foreignObject = document.createElementNS(xmlns, "foreignObject");

  svg.setAttribute("width", String(width));
  svg.setAttribute("height", String(height));
  svg.setAttribute("xmlns", xmlns);

  foreignObject.setAttribute("width", "100%");
  foreignObject.setAttribute("height", "100%");
  foreignObject.setAttribute("x", String(x));
  foreignObject.setAttribute("y", String(y));

  foreignObject.appendChild(node);
  svg.appendChild(foreignObject);

  return svg;
}

export function loadSerializedSVG(svg: Node): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(new XMLSerializer().serializeToString(svg))}`;
  });
}

export function testForeignObject(document: Document): Promise<boolean> {
  const canvas = document.createElement("canvas");
  const size = 100;
  canvas.width = size;
  canvas.height = size;

  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  if (!ctx) return Promise.resolve(false);

  ctx.fillStyle = "rgb(0, 255, 0)";
  ctx.fillRect(0, 0, size, size);

  const greenImageSrc = canvas.toDataURL();

  const img = new Image();
  img.src = greenImageSrc;

  ctx.fillStyle = "red";
  ctx.fillRect(0, 0, size, size);

  const isGreen = (data: Uint8ClampedArray): boolean =>
    data[0] === 0 && data[1] === 255 && data[2] === 0 && data[3] === 255;

  return loadSerializedSVG(createForeignObjectSVG(size, size, 0, 0, img))
    .then((rendered) => {
      ctx.drawImage(rendered, 0, 0);
      const data = ctx.getImageData(0, 0, size, size).data;
      ctx.fillStyle = "red";
      ctx.fillRect(0, 0, size, size);

      if (!isGreen(data)) return Promise.reject(false);

      const node = document.createElement("div");
      node.style.backgroundImage = `url(${greenImageSrc})`;
      node.style.height = `${size}px`;

      return loadSerializedSVG(createForeignObjectSVG(size, size, 0, 0, node));
    })
    .then((rendered) => {
      ctx.drawImage(rendered, 0, 0);
      return isGreen(ctx.getImageData(0, 0, size, size).data);
    })
    .catch(() => false);
}

const testCORS = (): boolean => typeof new Image().crossOrigin !== "undefined";

export const FEATURES = {
  get FOREIGNOBJECT(): Promise<boolean> {
    const value = testForeignObject(document);
    Object.defineProperty(FEATURES, "FOREIGNOBJECT", { value });
    return value;
  },
  get CORS_IMAGES(): boolean {
    const value = testCORS();
    Object.defineProperty(FEATURES, "CORS_IMAGES", { value });
    return value;
  },
};
