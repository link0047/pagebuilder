class ScrollLock {
  #locked: boolean = false;
  #scrollPosition: number = 0;
  #scrollbarWidth: number = 0;
  #controller: AbortController | null = null;

  lock(): void {
    if (this.#locked) return;

    // Create fresh controller for this lock
    this.#controller = new AbortController();
    const { signal } = this.#controller;

    // Store current scroll position
    this.#scrollPosition = window.scrollY || document.documentElement.scrollTop;

    // Get scrollbar width before hiding it
    this.#scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;

    // Prevent scroll
    document.documentElement.style.overflow = "hidden";
    document.documentElement.style.paddingRight = `${this.#scrollbarWidth}px`;
    document.body.style.overflow = "hidden";
    document.body.style.paddingRight = `${this.#scrollbarWidth}px`;

    // Prevent scroll on touch devices
    document.addEventListener("touchmove", this.#preventScroll, { passive: false, signal });
    document.addEventListener("wheel", this.#preventScroll, { passive: false, signal });

    this.#locked = true;
  }

  unlock(): void {
    if (!this.#locked) return;

    // Remove overflow hidden
    document.documentElement.style.overflow = "";
    document.documentElement.style.paddingRight = "";
    document.body.style.overflow = "";
    document.body.style.paddingRight = "";

    this.#controller?.abort();
    this.#controller = null;

    // Restore scroll position
    window.scrollTo(0, this.#scrollPosition);

    this.#locked = false;
  }

  destroy(): void {
    if (this.#locked) {
      this.unlock();
    }
  }

  #preventScroll = (event: Event): void => {
    event.preventDefault();
  };
}

export const scrollLock = new ScrollLock();