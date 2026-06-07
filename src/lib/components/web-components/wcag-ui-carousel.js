export {};

/**
 * wcag-ui-carousel
 *
 * Attributes:
 *   label             {string}  - aria-label for the carousel region (required for a11y)
 *   slides-per-view   {number}  - how many slides are visible at once          (default: 2)
 *   slides-per-group  {number}  - how many slides to advance per prev/next     (default: 1)
 *   space-between     {string}  - CSS gap between slides, any CSS length       (default: "1rem")
 *   starting-index    {number}  - 1-based slide to start on                    (default: 1)
 *   breakpoints       {string}  - JSON string: { "768": { slidesPerView: 3 } } (default: none)
 *
 * CSS custom properties (set on the host or any ancestor):
 *   --wcag-ui-carousel-button-width       (default: 2rem)
 *   --wcag-ui-carousel-controls-gap       (default: .25rem)
 *   --wcag-ui-carousel-slides-per-view    (managed internally — prefer the attribute)
 *   --wcag-ui-carousel-space-between      (managed internally — prefer the attribute)
 *   --wcag-ui-carousel-button-bg-hover    (default: rgba(0,0,0,.15))
 *   --wcag-ui-carousel-button-color       (default: #212121)
 *   --wcag-ui-carousel-transition-duration (default: .2s)
 *
 * Methods:
 *   prev()
 *   next()
 *   goTo(index, behavior?)
 */

class WCAGUICarousel extends HTMLElement {
  // ---------------------------------------------------------------------------
  // Static
  // ---------------------------------------------------------------------------
  static #counter = 0;
  static #template = document.createElement("template");
  static {
    this.#template.innerHTML = `
      <style>
        :host {
          display: block;
          position: relative;
          box-sizing: border-box;
          user-select: none;
          -webkit-user-drag: none;

          --wcag-ui-carousel-button-width: 2rem;
          --wcag-ui-carousel-controls-gap: .25rem;
          --wcag-ui-carousel-slides-per-view: 2;
          --wcag-ui-carousel-space-between: 1rem;
          --wcag-ui-carousel-button-bg-hover: rgba(0, 0, 0, 0.15);
          --wcag-ui-carousel-button-color: #212121;
          --wcag-ui-carousel-transition-duration: .2s;
          --wcag-ui-carousel-z: 999;
        }

        /* Visually hidden live region */
        .wcag-ui-carousel__status {
          position: absolute;
          width: 1px;
          height: 1px;
          padding: 0;
          margin: -1px;
          overflow: hidden;
          clip: rect(0, 0, 0, 0);
          white-space: nowrap;
          border-width: 0;
        }

        .wcag-ui-carousel__viewport {
          position: relative;
          anchor-name: --wcag-ui-carousel-track;
          padding-inline: calc(
            var(--wcag-ui-carousel-button-width) + var(--wcag-ui-carousel-controls-gap)
          );
        }

        .wcag-ui-carousel__track {
          box-sizing: border-box;
          display: grid;
          align-items: stretch;
          grid-auto-flow: column;
          grid-auto-columns: calc(
            (100% - (var(--wcag-ui-carousel-slides-per-view) - 1) * var(--wcag-ui-carousel-space-between))
            / var(--wcag-ui-carousel-slides-per-view)
          );
          grid-template-rows: repeat(1, max-content);
          column-gap: var(--wcag-ui-carousel-space-between);
          row-gap: 0;
          overflow-x: auto;
          overflow-y: hidden;
          -webkit-overflow-scrolling: touch;
          overscroll-behavior-x: none;
          scroll-behavior: smooth;
          scroll-snap-type: x mandatory;
          scrollbar-width: none;
        }

        .wcag-ui-carousel__track::-webkit-scrollbar {
          display: none;
        }

        /* Prev / next buttons */
        .wcag-ui-carousel__button {
          appearance: none;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 1px solid transparent;
          border-radius: .25rem;
          background-color: transparent;
          color: var(--wcag-ui-carousel-button-color);
          width: var(--wcag-ui-carousel-button-width);
          height: calc(var(--wcag-ui-carousel-button-width) * 2);
          position: absolute;
          top: 50%;
          z-index: var(--wcag-ui-carousel-z);
          transform: translateY(-50%);
          cursor: pointer;
          opacity: 0;
          pointer-events: none;
          transition:
            border-color var(--wcag-ui-carousel-transition-duration) ease-in-out,
            background-color var(--wcag-ui-carousel-transition-duration) ease-in-out,
            opacity var(--wcag-ui-carousel-transition-duration) ease-in-out;

          @supports (top: anchor(--name center)) {
            position-anchor: --wcag-ui-carousel-track;
            top: anchor(--wcag-ui-carousel-track center, 50%);
          }
        }

        :host(:hover) .wcag-ui-carousel__button {
          opacity: 1;
          pointer-events: auto;
        }

        .wcag-ui-carousel__button:not(:disabled):hover {
          background-color: var(--wcag-ui-carousel-button-bg-hover);
        }

        .wcag-ui-carousel__button:disabled {
          display: none;
        }

        .wcag-ui-carousel__button--prev { left: 0; }
        .wcag-ui-carousel__button--next { right: 0; }

        @media (prefers-reduced-motion: reduce) {
          .wcag-ui-carousel__track {
            scroll-behavior: auto;
          }
          .wcag-ui-carousel__button {
            transition: none;
          }
        }
      </style>

      <div class="wcag-ui-carousel__status" role="status" aria-live="polite" aria-atomic="true"></div>

      <button
        type="button"
        class="wcag-ui-carousel__button wcag-ui-carousel__button--prev"
        part="button button-prev"
        aria-label="Previous slide"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 12 24" aria-hidden="true" focusable="false" width="12" height="24" fill="currentColor">
          <path d="M6.5,22.7c.2.5.6.8,1.1.8.8,0,1.3-.6,1.3-1.3s-.2-.9-.3-1.2l-3.5-9,3.5-9c.1-.3.3-.8.3-1.2,0-.7-.5-1.3-1.3-1.3,0,0,0,0,0,0-.5,0-.9.3-1.1.8l-3.5,8.8c-.2.6-.5,1.3-.5,1.9s.3,1.3.5,1.9l3.5,8.8h0Z" />
        </svg>
      </button>

      <div class="wcag-ui-carousel__viewport" part="viewport">
        <div class="wcag-ui-carousel__track" part="track">
          <slot></slot>
        </div>
      </div>

      <button
        type="button"
        class="wcag-ui-carousel__button wcag-ui-carousel__button--next"
        part="button button-next"
        aria-label="Next slide"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 12 24" aria-hidden="true" focusable="false" width="12" height="24" fill="currentColor">
          <path d="M5,22.7c-.2.5-.6.8-1.1.8-.8,0-1.3-.6-1.3-1.3s.2-.9.3-1.2l3.5-9L2.9,3c-.1-.3-.3-.8-.3-1.2,0-.7.5-1.3,1.3-1.3,0,0,0,0,0,0,.5,0,.9.3,1.1.8l3.5,8.8c.2.6.5,1.3.5,1.9s-.3,1.3-.5,1.9l-3.5,8.8h0Z" />
        </svg>
      </button>
    `;
  }

  static get observedAttributes() {
    return [
      "label",
      "slides-per-view",
      "slides-per-group",
      "space-between",
      "starting-index",
      "breakpoints",
      "equal-height",
    ];
  }

  // ---------------------------------------------------------------------------
  // Private fields
  // ---------------------------------------------------------------------------

  /** @type {AbortController|null} */
  #abortController = null;
  /** @type {IntersectionObserver|null} */
  #intersectionObserver = null;
  /** @type {Array<{ mql: MediaQueryList, config: object }>} */
  #mediaQueries = [];

  #carouselId = "";
  #trackId = "";

  /** @type {HTMLElement | null} */
  #track = null;
  /** @type {HTMLElement | null} */
  #status = null;
  /** @type {HTMLButtonElement | null} */
  #prevButton = null;
  /** @type {HTMLButtonElement | null} */
  #nextButton = null;
  /** @type {boolean} */
  #equalHeight = false;

  // Resolved options (may change with breakpoints)
  #slidesPerView = 2;
  #slidesPerGroup = 1;
  #spaceBetween = "1rem";

  // These are the author-supplied defaults — restored when no breakpoint matches
  #defaultSlidesPerView = 2;
  #defaultSlidesPerGroup = 1;
  #defaultSpaceBetween = "1rem";

  #currentSlide = 1; // 1-based
  #totalSlides = 0;

  // ---------------------------------------------------------------------------
  // Constructor
  // ---------------------------------------------------------------------------

  constructor() {
    super();
    const root = /** @type {ShadowRoot} */ (this.attachShadow({ mode: "open", delegatesFocus: true }));
    root.appendChild(WCAGUICarousel.#template.content.cloneNode(true));

    const uid = WCAGUICarousel.#counter++;
    this.#carouselId = `wcag-ui-carousel-${uid}`;
    this.#trackId = `${this.#carouselId}-track`;

    this.#track = root.querySelector(".wcag-ui-carousel__track");
    this.#status = root.querySelector(".wcag-ui-carousel__status");
    this.#prevButton = root.querySelector(".wcag-ui-carousel__button--prev");
    this.#nextButton = root.querySelector(".wcag-ui-carousel__button--next");
  }

  // ---------------------------------------------------------------------------
  // Lifecycle
  // ---------------------------------------------------------------------------

  connectedCallback() {
    this.id ||= this.#carouselId;
    this.setAttribute("role", "region");
    this.setAttribute("aria-roledescription", "carousel");

    if (this.hasAttribute("label")) {
      this.setAttribute("aria-label", this.getAttribute("label") ?? "");
    }

    if (this.#track) this.#track.id = this.#trackId;
    this.#prevButton?.setAttribute("aria-controls", this.#trackId);
    this.#nextButton?.setAttribute("aria-controls", this.#trackId);

    this.#abortController = new AbortController();
    const { signal } = this.#abortController;

    this.#prevButton?.addEventListener("click", () => this.prev(), { signal });
    this.#nextButton?.addEventListener("click", () => this.next(), { signal });

    this.#track?.addEventListener("scrollend", this.#onScrollEnd, { signal });

    // Wrap any direct children that aren't already wcag-ui-carousel-item
    this.#wrapBareChildren();

    // Wait for custom element upgrades before indexing slides
    customElements.whenDefined("wcag-ui-carousel-item").then(() => {
      this.#indexSlides();
      this.#setupIntersectionObserver();
      this.#setupBreakpoints();
      this.#applyTrackCSSVars();

      const startingIndex = parseInt(this.getAttribute("starting-index") ?? "1", 10);
      if (!isNaN(startingIndex) && startingIndex > 1) {
        requestAnimationFrame(() => this.goTo(startingIndex, "instant"));
      } else {
        this.#updateButtonStates();
        this.#updateStatus();
      }
    });

    // Keep slide count fresh when children are added/removed at runtime
    const slotEl = this.shadowRoot?.querySelector("slot");
    slotEl?.addEventListener("slotchange", this.#onSlotChange, { signal });
  }

  disconnectedCallback() {
    this.#abortController?.abort();
    this.#abortController = null;
    this.#intersectionObserver?.disconnect();
    this.#intersectionObserver = null;
    this.#teardownBreakpoints();
  }

  /**
   * @param {string} name
   * @param {string | null} oldValue
   * @param {string | null} newValue
   */
  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue === newValue) return;

    switch (name) {
      case "label":
        if (newValue !== null) {
          this.setAttribute("aria-label", newValue);
        } else {
          this.removeAttribute("aria-label");
        }
        break;

      case "slides-per-view": {
        const n = parseFloat(newValue ?? "2");
        this.#defaultSlidesPerView = isNaN(n) ? 2 : n;
        // Only apply immediately when no breakpoint is overriding
        if (!this.#activeBreakpointConfig()) {
          this.#slidesPerView = this.#defaultSlidesPerView;
          this.#applyTrackCSSVars();
          this.#updateButtonStates();
        }
        break;
      }

      case "slides-per-group": {
        const n = parseInt(newValue ?? "1", 10);
        this.#defaultSlidesPerGroup = isNaN(n) ? 1 : n;
        if (!this.#activeBreakpointConfig()) {
          this.#slidesPerGroup = this.#defaultSlidesPerGroup;
        }
        break;
      }

      case "space-between":
        this.#defaultSpaceBetween = newValue ?? "1rem";
        if (!this.#activeBreakpointConfig()) {
          this.#spaceBetween = this.#defaultSpaceBetween;
          this.#applyTrackCSSVars();
        }
        break;

      case "breakpoints":
        this.#teardownBreakpoints();
        if (this.#abortController) {
          this.#setupBreakpoints();
        }
        break;

      case "equal-height":
        this.#equalHeight = newValue !== null;
        this.#applyEqualHeight();
        break;
    }
  }

  // ---------------------------------------------------------------------------
  // Public API
  // ---------------------------------------------------------------------------

  /** Move to the previous slide group. */
  prev() {
    if (this.#isAtStart) return;
    this.#currentSlide = Math.max(1, this.#currentSlide - this.#slidesPerGroup);
    this.#scrollToSlide(this.#currentSlide);
    this.#updateButtonStates();
    this.#updateStatus();
  }

  /** Move to the next slide group. */
  next() {
    if (this.#isAtEnd) return;
    this.#currentSlide = Math.min(this.#maxSlideIndex, this.#currentSlide + this.#slidesPerGroup);
    this.#scrollToSlide(this.#currentSlide);
    this.#updateButtonStates();
    this.#updateStatus();
  }

  /**
   * Jump to a specific 1-based slide index.
   * @param {number} index
   * @param {"smooth"|"instant"} [behavior="smooth"]
   */
  goTo(index, behavior = "smooth") {
    if (index < 1 || index > this.#maxSlideIndex) return;
    this.#currentSlide = index;
    this.#scrollToSlide(index, behavior);
    this.#updateButtonStates();
    this.#updateStatus();
  }

  /** Current 1-based active slide index (read-only). */
  get currentSlide() {
    return this.#currentSlide;
  }

  /** Total number of slides (read-only). */
  get totalSlides() {
    return this.#totalSlides;
  }

  // ---------------------------------------------------------------------------
  // Private helpers
  // ---------------------------------------------------------------------------

  get #isAtStart() {
    return this.#currentSlide <= 1;
  }

  get #isAtEnd() {
    return this.#currentSlide >= this.#maxSlideIndex;
  }

  /** Highest index a slide can be the "active" (leftmost visible) slide. */
  get #maxSlideIndex() {
    return Math.max(1, Math.floor(this.#totalSlides - this.#slidesPerView + 1));
  }

  /** Returns all direct wcag-ui-carousel-item children (including auto-wrapped ones). */
  #slideItems() {
    return Array.from(this.children).filter(
      (el) => el.tagName.toLowerCase() === "wcag-ui-carousel-item"
    );
  }

  /**
   * Any direct child that is NOT a wcag-ui-carousel-item gets wrapped in one.
   * This runs once on connectedCallback; slotchange handles runtime additions.
   */
  #wrapBareChildren() {
    const toWrap = Array.from(this.children).filter(
      (el) => el.tagName.toLowerCase() !== "wcag-ui-carousel-item"
    );
    for (const child of toWrap) {
      const wrapper = document.createElement("wcag-ui-carousel-item");
      this.insertBefore(wrapper, child);
      wrapper.appendChild(child);
    }
  }

  /** Assign 1-based positions to every slide item and update internal counts. */
  #indexSlides() {
    const items = this.#slideItems();
    this.#totalSlides = items.length;
    items.forEach((item, i) => {
      /** @type {{ setSlidePosition?: (index: number, total: number) => void } & Element} */
      (item).setSlidePosition?.(i + 1, this.#totalSlides);
    });
    this.#updateButtonStates();
    this.#updateStatus();
  }

  /**
   * @param {number} slideIndex
   * @param {ScrollBehavior} [behavior="smooth"]
   */
  #scrollToSlide(slideIndex, behavior = "smooth") {
    if (!this.#track) return;

    const items = this.#slideItems();
    const target = /** @type {HTMLElement | undefined} */ (items[slideIndex - 1]);

    if (!target) return;

    if (slideIndex >= this.#maxSlideIndex) {
      this.#track.scrollTo({ left: this.#track.scrollWidth, behavior });
      return;
    }

    this.#track.scrollTo({ left: target.offsetLeft, behavior });
  }

  #updateButtonStates() {
    /** @type {HTMLButtonElement} */ (this.#prevButton).disabled = this.#isAtStart;
    /** @type {HTMLButtonElement} */ (this.#nextButton).disabled = this.#isAtEnd;
  }

  #updateStatus() {
    /** @type {HTMLElement} */ (this.#status).textContent = `Slide ${this.#currentSlide} of ${this.#totalSlides}`;
  }

  #applyTrackCSSVars() {
    this.style.setProperty(
      "--wcag-ui-carousel-slides-per-view",
      String(this.#slidesPerView)
    );
    this.style.setProperty("--wcag-ui-carousel-space-between", this.#spaceBetween);
  }

  #setupIntersectionObserver() {
    this.#intersectionObserver?.disconnect();

    this.#intersectionObserver = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.intersectionRatio < 0.1) {
            entry.target.setAttribute("aria-hidden", "true");
          } else {
            entry.target.removeAttribute("aria-hidden");
          }
        }
      },
      { root: this.#track, threshold: [0, 0.1] }
    );

    for (const item of this.#slideItems()) {
      this.#intersectionObserver.observe(item);
    }
  }

  // ---------------------------------------------------------------------------
  // Breakpoints
  // ---------------------------------------------------------------------------

  #setupBreakpoints() {
    if (!this.#abortController) return;
    const raw = this.getAttribute("breakpoints");
    if (!raw) return;

    let config;
    try {
      config = JSON.parse(raw);
    } catch {
      console.warn("wcag-ui-carousel: invalid JSON in breakpoints attribute.");
      return;
    }

    this.#mediaQueries = Object.entries(config)
      .map(([bp, cfg]) => ({
        mql: window.matchMedia(`(min-width: ${bp}px)`),
        config: cfg,
      }))
      .sort((a, b) => {
        const aW = parseInt(a.mql.media.match(/\d+/)?.[0] ?? "0", 10);
        const bW = parseInt(b.mql.media.match(/\d+/)?.[0] ?? "0", 10);
        return bW - aW; // descending — widest breakpoint checked first
      });

    const { signal } = this.#abortController;
    for (const { mql } of this.#mediaQueries) {
      mql.addEventListener("change", this.#onBreakpointChange, { signal });
    }

    this.#onBreakpointChange();
  }

  #teardownBreakpoints() {
    // Listeners are tied to the AbortController signal, so they self-clean on
    // disconnect. We just need to reset any overridden values.
    this.#mediaQueries = [];
    this.#slidesPerView = this.#defaultSlidesPerView;
    this.#slidesPerGroup = this.#defaultSlidesPerGroup;
    this.#spaceBetween = this.#defaultSpaceBetween;

    if (this.#abortController) {
      this.#applyTrackCSSVars();
    }
  }

  #activeBreakpointConfig() {
    return this.#mediaQueries.find(({ mql }) => mql.matches)?.config ?? null;
  }

  #onBreakpointChange = () => {
    const matched = /** @type {{ slidesPerView?: number | string, slidesPerGroup?: number | string, spaceBetween?: string } | null} */ (this.#activeBreakpointConfig());

    if (matched) {
      this.#slidesPerView = typeof matched.slidesPerView === "number"
        ? matched.slidesPerView
        : parseFloat(/** @type {string} */ (matched.slidesPerView ?? this.#defaultSlidesPerView));
      this.#slidesPerGroup = typeof matched.slidesPerGroup === "number"
        ? matched.slidesPerGroup
        : parseInt(/** @type {string} */ (matched.slidesPerGroup ?? this.#defaultSlidesPerGroup), 10);
      this.#spaceBetween = matched.spaceBetween ?? this.#defaultSpaceBetween;
    } else {
      this.#slidesPerView = this.#defaultSlidesPerView;
      this.#slidesPerGroup = this.#defaultSlidesPerGroup;
      this.#spaceBetween = this.#defaultSpaceBetween;
    }

    this.#applyTrackCSSVars();
    this.#updateButtonStates();
    this.#applyEqualHeight();
  };

  #applyEqualHeight = async () => {
    if (!this.#equalHeight) return;

    const items = this.#slideItems();
    const firstItem = /** @type {HTMLElement | undefined} */ (items[0]);
    if (!firstItem) return;

    const content = /** @type {HTMLElement | null} */ (firstItem.firstElementChild);
    if (!content) return;

    const img = content.querySelector("img");
    if (img && !img.complete) {
      await new Promise(resolve => {
        img.addEventListener("load", resolve, { once: true });
        img.addEventListener("error", resolve, { once: true });
      });
    }

    const height = content.offsetHeight;
    if (height <= 0) return;

    const track = /** @type {HTMLElement} */ (this.#track);
    track.style.height = `${height}px`;

    items.forEach((item) => {
      /** @type {HTMLElement} */ (item).style.height = `${height}px`;
    });
  };

  // ---------------------------------------------------------------------------
  // Event handlers
  // ---------------------------------------------------------------------------

  #onScrollEnd = () => {
    const track = /** @type {HTMLElement} */ (this.#track);
    const slideWidth = track.scrollWidth / this.#totalSlides;
    const newSlide = Math.round(track.scrollLeft / slideWidth) + 1;

    if (newSlide !== this.#currentSlide) {
      this.#currentSlide = newSlide;
      this.#updateButtonStates();
      this.#updateStatus();
    }
  };

  #onSlotChange = () => {
    this.#wrapBareChildren();
    customElements.whenDefined("wcag-ui-carousel-item").then(() => {
      this.#indexSlides();
      this.#setupIntersectionObserver();
    });
  };
}

if (typeof customElements !== "undefined" && !customElements.get("wcag-ui-carousel")) {
  customElements.define("wcag-ui-carousel", WCAGUICarousel);
}
