class ScrollLock {
  #locked: boolean = false;
  #lockCount: number = 0;
  #scrollPosition: number = 0;
  #scrollbarWidth: number = 0;
  #savedPaddingRight: string = "";
  #controller: AbortController | null = null;

  lock(): void {
    if (typeof window === "undefined") return;
    this.#lockCount++;
    if (this.#lockCount > 1) return;

    this.#controller = new AbortController();
    const { signal } = this.#controller;

    this.#scrollPosition = window.scrollY;
    this.#scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    this.#savedPaddingRight = document.documentElement.style.paddingRight;

    document.documentElement.style.overflow = "hidden";
    document.documentElement.style.paddingRight = `${this.#scrollbarWidth}px`;

    document.addEventListener("touchmove", this.#preventScroll, { passive: false, signal });
    document.addEventListener("wheel", this.#preventScroll, { passive: false, signal });

    this.#locked = true;
  }

  unlock(): void {
    if (typeof window === "undefined") return;
    if (this.#lockCount === 0) return;
    this.#lockCount--;
    if (this.#lockCount > 0) return;

    document.documentElement.style.overflow = "";
    document.documentElement.style.paddingRight = this.#savedPaddingRight;

    this.#controller?.abort();
    this.#controller = null;

    window.scrollTo(0, this.#scrollPosition);
    this.#locked = false;
  }

  destroy(): void {
    if (this.#locked) this.unlock();
  }

  #preventScroll = (event: Event): void => {
    const target = event.target as HTMLElement | null;
    if (target?.closest("[data-scroll-lock-ignore]")) return;
    event.preventDefault();
  };
}

export const scrollLock = new ScrollLock();
