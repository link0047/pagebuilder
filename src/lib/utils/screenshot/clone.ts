const inlineStyles = (source: Element, target: Element): void => {
  const computed = window.getComputedStyle(source);
  Array.from(computed).forEach((key) => {
    (target as HTMLElement).style.setProperty(key, computed.getPropertyValue(key));
  });
};

const cloneIframe = (iframe: HTMLIFrameElement): Promise<HTMLIFrameElement> => {
  const doc = iframe.contentDocument;
  if (!doc) {
    return Promise.resolve(iframe.cloneNode(true) as HTMLIFrameElement);
  }

  const clone = iframe.cloneNode(false) as HTMLIFrameElement;

  clone.removeAttribute("src");
  clone.setAttribute("srcdoc", doc.documentElement.outerHTML);
  clone.style.setProperty("width", String(iframe.offsetWidth) + "px");
  clone.style.setProperty("height", String(iframe.offsetHeight) + "px");
  clone.style.position = "fixed";
  clone.style.top = "0";
  clone.style.left = "0";
  clone.style.zIndex = "9999";

  return new Promise((resolve) => {
    clone.addEventListener("load", () => {
      resolve(clone);
    }, { once: true });
    document.body.appendChild(clone);
  });
};

export async function cloneElement(element: HTMLElement): Promise<HTMLElement> {
  const clone = element.cloneNode(false) as HTMLElement;

  inlineStyles(element, clone);

  const iframe = element.querySelector("iframe");
  if (iframe) {
    const clonedIframe = await cloneIframe(iframe);
    document.body.removeChild(clonedIframe);
    clone.appendChild(clonedIframe);
  }

  return clone;
}
