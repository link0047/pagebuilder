type MaybeElement = HTMLElement | null | undefined;

export function getBoundingRects(
  elements: HTMLElement[],
  options?: {
    root?: MaybeElement,
    timeout?: number
  }
): Promise<Map<HTMLElement, DOMRectReadOnly>> {
  return new Promise((resolve, reject) => {
    if (!Array.isArray(elements) || elements.length === 0) {
      resolve(new Map());
      return;
    }

    let processedCount = 0;
    const count = elements.length;
    const timeout = options?.timeout ?? 5000;
    const root = options?.root ?? null;
    const rects = new Map<HTMLElement, DOMRectReadOnly>();

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(({ target, boundingClientRect }) => {
        rects.set(target as HTMLElement, boundingClientRect);
        observer.unobserve(target);
        processedCount++;

        if (processedCount === count) {
          clearTimeout(timeoutId);
          observer.disconnect();
          resolve(rects);
        }
      });
    }, {
      root,
      threshold: 0,
      rootMargin: "0px"
    });

    const timeoutId = setTimeout(() => {
      observer.disconnect();
      reject(new Error(`Timeout: only ${processedCount}/${count} elements processed`));
    }, timeout);

    elements.forEach((element) => {
      observer.observe(element);
    });
  });
}
