export {};

import "./wcag-ui-dot-indicator.js";
import "./wcag-ui-carousel-item.js";

/**
 * @param {TemplateStringsArray} strings
 * @param {any[]} values
 * @returns {string}
 */
const html = (strings, ...values) => String.raw(strings, ...values);

/**
 * @typedef {"dots" | "pill" | "fraction"} PaginationVariant
 * @typedef {"top" | "bottom"} PaginationVertical
 * @typedef {"start" | "center" | "end"} PaginationHorizontal
 * @typedef {"inline" | "overlay" | "grouped"} ControlsMode
 * @typedef {"top" | "center" | "bottom"} ControlsVertical
 *
 * @typedef {Object} PaginationPlacement
 * @property {PaginationVertical} [vertical]
 * @property {PaginationHorizontal} [horizontal]
 * @property {boolean} [overlay]
 *
 * @typedef {Object} PaginationOptions
 * @property {PaginationVariant} [variant]
 * @property {boolean} [dynamicDots]
 * @property {PaginationPlacement} [placement]
 *
 * @typedef {Object} ControlsOptions
 * @property {ControlsMode} [mode]
 * @property {ControlsVertical} [vertical]
 * @property {string} [inset]
 * @property {boolean} [persistent]
 * @property {boolean} [hoverReveal]
 * @property {PaginationPlacement} [placement]
 *
 * @typedef {Object} BreakpointConfig
 * @property {number} [slidesPerView]
 * @property {number} [slidesPerGroup]
 * @property {string} [gap]
 */

const PREV_ICON_STD = '<path d="M6.5,22.7c.2.5.6.8,1.1.8.8,0,1.3-.6,1.3-1.3s-.2-.9-.3-1.2l-3.5-9,3.5-9c.1-.3.3-.8.3-1.2,0-.7-.5-1.3-1.3-1.3,0,0,0,0,0,0-.5,0-.9.3-1.1.8l-3.5,8.8c-.2.6-.5,1.3-.5,1.9s.3,1.3.5,1.9l3.5,8.8h0Z"/>';
const NEXT_ICON_STD = '<path d="M5,22.7c-.2.5-.6.8-1.1.8-.8,0-1.3-.6-1.3-1.3s.2-.9.3-1.2l3.5-9L2.9,3c-.1-.3-.3-.8-.3-1.2,0-.7.5-1.3,1.3-1.3,0,0,0,0,0,0,.5,0,.9.3,1.1.8l3.5,8.8c.2.6.5,1.3.5,1.9s-.3,1.3-.5,1.9l-3.5,8.8h0Z"/>';
const PREV_ICON_GROUPED = '<path d="M15.41,16.58L10.83,12L15.41,7.41L14,6L8,12L14,18L15.41,16.58Z"/>';
const NEXT_ICON_GROUPED = '<path d="M8.59,16.58L13.17,12L8.59,7.41L10,6L16,12L10,18L8.59,16.58Z"/>';

/**
 * wcag-ui-carousel
 *
 * Attributes:
 *   label             {string}  - aria-label for the carousel region (required for a11y)
 *   slides-per-view   {number}  - visible slides                              (default: 2)
 *   slides-per-group  {number}  - slides advanced per prev/next               (default: 1)
 *   gap               {string}  - CSS gap between slides                       (default: "1rem")
 *   starting-index    {number}  - 1-based slide to start on                   (default: 1)
 *   breakpoints       {string}  - JSON: { "768": { slidesPerView: 3 } }
 *   pagination        {string}  - "false" | JSON PaginationOptions            (default: on)
 *   controls          {string}  - "false" | JSON ControlsOptions              (default: on)
 *   equal-height          {string} - "" | "auto" | "uniform" | <CSS length>
 *   equal-height-samples  {number} - leading slides to measure for "uniform"
 *
 * Slots:
 *   prev-icon / next-icon  - custom arrow icon markup (falls back to defaults)
 *
 * Methods: prev(), next(), goTo(index, behavior?)
 */
class WCAGUICarousel extends HTMLElement {
  static #counter = 0;
  static #template = document.createElement("template");
  static {
    this.#template.innerHTML = html`
      <style>
        :host {
          display: flex;
          flex-direction: column;
          position: relative;
          box-sizing: border-box;
          user-select: none;
          -webkit-user-drag: none;

          --wcag-ui-carousel-button-width: 2rem;
          --wcag-ui-carousel-controls-gap: .25rem;
          --wcag-ui-carousel-controls-inset: var(--wcag-ui-carousel-controls-gap);
          --wcag-ui-carousel-slides-per-view: 2;
          --wcag-ui-carousel-space-between: 1rem;
          --wcag-ui-carousel-button-bg-hover: rgba(0, 0, 0, 0.15);
          --wcag-ui-carousel-button-color: #212121;
          --wcag-ui-carousel-transition-duration: .2s;
          --wcag-ui-carousel-z: 999;
        }

        .status {
          position: absolute;
          width: 1px; height: 1px;
          padding: 0; margin: -1px;
          overflow: hidden;
          clip: rect(0, 0, 0, 0);
          white-space: nowrap;
          border-width: 0;
        }

        .viewport {
          position: relative;
          anchor-name: --wcag-ui-carousel-track;
          order: 2;
        }

        :host([data-controls-mode="inline"]) .viewport {
          padding-inline: calc(
            var(--wcag-ui-carousel-button-width) + var(--wcag-ui-carousel-controls-gap)
          );
        }

        .track {
          box-sizing: border-box;
          display: grid;
          align-items: start;
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

        .track::-webkit-scrollbar { display: none; }

        .button {
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
          cursor: pointer;
          transition:
            border-color var(--wcag-ui-carousel-transition-duration) ease-in-out,
            background-color var(--wcag-ui-carousel-transition-duration) ease-in-out,
            opacity var(--wcag-ui-carousel-transition-duration) ease-in-out;
        }

        .button svg { pointer-events: none; }

        /* Track-relative arrows (inline + overlay). */
        :host([data-controls-mode="inline"]) .button,
        :host([data-controls-mode="overlay"]) .button {
          position: absolute;
          top: 50%;
          z-index: var(--wcag-ui-carousel-z);
          transform: translateY(-50%);

          @supports (top: anchor(--name center)) {
            position-anchor: --wcag-ui-carousel-track;
            top: anchor(--wcag-ui-carousel-track center, 50%);
          }
        }

        :host([data-controls-mode="inline"]) .button--prev { left: 0; }
        :host([data-controls-mode="inline"]) .button--next { right: 0; }
        :host([data-controls-mode="overlay"]) .button--prev {
          left: var(--wcag-ui-carousel-controls-inset);
        }
        :host([data-controls-mode="overlay"]) .button--next {
          right: var(--wcag-ui-carousel-controls-inset);
        }

        :host([data-controls-mode="overlay"][data-controls-vertical="top"]) .button {
          top: var(--wcag-ui-carousel-controls-inset);
          transform: none;
        }
        :host([data-controls-mode="overlay"][data-controls-vertical="bottom"]) .button {
          top: auto;
          bottom: var(--wcag-ui-carousel-controls-inset);
          transform: none;
        }

        /* hoverReveal */
        :host([data-controls-hover-reveal][data-controls-mode="inline"]) .button,
        :host([data-controls-hover-reveal][data-controls-mode="overlay"]) .button {
          opacity: 0;
          pointer-events: none;
        }
        :host([data-controls-hover-reveal][data-controls-mode="inline"]:hover) .button,
        :host([data-controls-hover-reveal][data-controls-mode="overlay"]:hover) .button {
          opacity: 1;
          pointer-events: auto;
        }

        .button:not(:disabled):hover {
          background-color: var(--wcag-ui-carousel-button-bg-hover);
        }

        /* persistent off (default): remove disabled arrows */
        :host(:not([data-controls-persistent])) .button:disabled {
          display: none;
        }
        /* persistent on: keep dimmed + inert */
        :host([data-controls-persistent]) .button:disabled {
          opacity: 0.35;
          cursor: default;
          pointer-events: none;
        }
        :host([data-controls-hover-reveal][data-controls-persistent]) .button:disabled {
          opacity: 0;
        }
        :host([data-controls-hover-reveal][data-controls-persistent]:hover) .button:disabled {
          opacity: 0.35;
        }

        /* Controls row */
        .controls {
          display: flex;
          align-items: center;
          gap: var(--wcag-ui-carousel-controls-gap);
          width: 100%;
          box-sizing: border-box;
          padding-block: 0.5rem;
        }

        :host([data-pagination-horizontal="start"]) .controls { justify-content: flex-start; }
        :host([data-pagination-horizontal="center"]) .controls { justify-content: center; }
        :host([data-pagination-horizontal="end"]) .controls { justify-content: flex-end; }

        :host([data-pagination-vertical="top"]) .controls { order: 1; }
        :host([data-pagination-vertical="bottom"]) .controls { order: 3; }

        /* Grouped arrows: static in the row, always visible, square */
        :host([data-controls-mode="grouped"]) .controls .button {
          position: static;
          transform: none;
          opacity: 1;
          pointer-events: auto;
          height: var(--wcag-ui-carousel-button-width);
        }

        /* Overlay pagination */
        :host([data-pagination-overlay]) .controls {
          position: absolute;
          width: auto;
          z-index: var(--wcag-ui-carousel-z);
          left: 50%;
          transform: translateX(-50%);
        }
        :host([data-pagination-overlay][data-pagination-horizontal="start"]) .controls {
          left: var(--wcag-ui-carousel-controls-gap);
          transform: none;
        }
        :host([data-pagination-overlay][data-pagination-horizontal="end"]) .controls {
          left: auto;
          right: var(--wcag-ui-carousel-controls-gap);
          transform: none;
        }
        :host([data-pagination-overlay][data-pagination-vertical="top"]) .controls {
          top: var(--wcag-ui-carousel-controls-gap);
          bottom: auto;
        }
        :host([data-pagination-overlay][data-pagination-vertical="bottom"]) .controls {
          bottom: var(--wcag-ui-carousel-controls-gap);
          top: auto;
        }

        .fraction {
          font: inherit;
          color: var(--wcag-ui-carousel-button-color);
        }

        .dots { display: flex; }

        :host([data-controls-mode="grouped"]) .track-arrows { display: none; }
        .controls[hidden] { display: none; }

        @media (prefers-reduced-motion: reduce) {
          .track { scroll-behavior: auto; }
          .button { transition: none; }
        }
      </style>

      <div class="status" role="status" aria-live="polite" aria-atomic="true"></div>

      <div class="track-arrows">
        <button type="button" class="button button--prev" part="button button-prev" aria-label="Previous slide">
          <slot name="prev-icon"><svg class="icon-prev" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 12 24" aria-hidden="true" focusable="false" width="12" height="24" fill="currentColor">${PREV_ICON_STD}</svg></slot>
        </button>
        <button type="button" class="button button--next" part="button button-next" aria-label="Next slide">
          <slot name="next-icon"><svg class="icon-next" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 12 24" aria-hidden="true" focusable="false" width="12" height="24" fill="currentColor">${NEXT_ICON_STD}</svg></slot>
        </button>
      </div>

      <div class="viewport" part="viewport">
        <div class="track" part="track">
          <slot></slot>
        </div>
      </div>

      <div class="controls" part="controls" hidden></div>
    `;
  }

  static get observedAttributes() {
    return [
      "label",
      "slides-per-view",
      "slides-per-group",
      "gap",
      "starting-index",
      "breakpoints",
      "pagination",
      "controls",
      "equal-height",
      "equal-height-samples",
    ];
  }

  /** @type {AbortController | null} */
  #abortController = null;
  /** @type {IntersectionObserver | null} */
  #intersectionObserver = null;
  /** @type {ResizeObserver | null} */
  #resizeObserver = null;
  /** @type {Array<{ mql: MediaQueryList, config: BreakpointConfig }>} */
  #mediaQueries = [];

  /** @type {string} */
  #carouselId = "";
  /** @type {string} */
  #trackId = "";

  /** @type {HTMLElement | null} */
  #track = null;
  /** @type {HTMLElement | null} */
  #status = null;
  /** @type {HTMLElement | null} */
  #viewport = null;
  /** @type {HTMLElement | null} */
  #trackArrows = null;
  /** @type {HTMLButtonElement | null} */
  #prevButton = null;
  /** @type {HTMLButtonElement | null} */
  #nextButton = null;
  /** @type {HTMLElement | null} */
  #controlsRow = null;
  /** @type {HTMLButtonElement | null} */
  #groupedPrev = null;
  /** @type {HTMLButtonElement | null} */
  #groupedNext = null;
  /** @type {HTMLElement | null} */
  #dotIndicator = null;
  /** @type {HTMLElement | null} */
  #fraction = null;

  /** @type {string} */
  #equalHeight = "";
  /** @type {number} */
  #equalHeightSamples = NaN;
  /** @type {number} */
  #equalHeightRaf = 0;
  /** @type {Set<HTMLImageElement>} */
  #equalHeightImages = new Set();
  /** @type {number} */
  #lastWidth = NaN;

  /** @type {number} */
  #slidesPerView = 2;
  /** @type {number} */
  #slidesPerGroup = 1;
  /** @type {string} */
  #gap = "1rem";
  /** @type {number} */
  #defaultSlidesPerView = 2;
  /** @type {number} */
  #defaultSlidesPerGroup = 1;
  /** @type {string} */
  #defaultGap = "1rem";

  /** @type {number} */
  #currentSlide = 1;
  /** @type {number} */
  #totalSlides = 0;

  /** @type {PaginationOptions | null} */
  #pagination = {};
  /** @type {ControlsOptions | null} */
  #controls = {};
  /** @type {boolean} */
  #supportsScrollEnd = typeof window !== "undefined" && "onscrollend" in window;
  /** @type {number} */
  #scrollEndTimer = 0;
  /**
   * The intended slide of an in-flight programmatic scroll (prev/next/goTo), or
   * -1 when none. Lets the settle handler tell our own scroll from a user swipe,
   * and re-issue if the smooth scroll settled short under rapid clicks.
   * @type {number}
   */
  #programmaticTarget = -1;
  /** @type {number} */
  #programmaticClearTimer = 0;

  constructor() {
    super();
    const root = this.attachShadow({ mode: "open", delegatesFocus: true });
    root.appendChild(WCAGUICarousel.#template.content.cloneNode(true));

    const uid = WCAGUICarousel.#counter++;
    this.#carouselId = `wcag-ui-carousel-${uid}`;
    this.#trackId = `${this.#carouselId}-track`;

    this.#track = root.querySelector(".track");
    this.#status = root.querySelector(".status");
    this.#viewport = root.querySelector(".viewport");
    this.#trackArrows = root.querySelector(".track-arrows");
    this.#prevButton = root.querySelector(".button--prev");
    this.#nextButton = root.querySelector(".button--next");
    this.#controlsRow = root.querySelector(".controls");
  }

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

    if (this.#supportsScrollEnd) {
      this.#track?.addEventListener("scrollend", this.#onScrollSettled, { signal });
    } else {
      this.#track?.addEventListener("scroll", this.#onScrollDebounced, { signal, passive: true });
    }

    this.#parsePagination(this.getAttribute("pagination"));
    this.#parseControls(this.getAttribute("controls"));
    this.#equalHeight = this.#resolveEqualHeightMode(this.getAttribute("equal-height"));
    this.#equalHeightSamples = this.#resolveEqualHeightSamples(
      this.getAttribute("equal-height-samples")
    );

    customElements.whenDefined("wcag-ui-carousel-item").then(() => {
      this.#indexSlides();
      this.#setupIntersectionObserver();
      this.#setupResizeObserver();
      this.#setupBreakpoints();
      this.#applyTrackCSSVars();
      this.#applyPlacementAttributes();
      this.#renderControlsRow();
      this.#applyEqualHeight();

      const startingIndex = parseInt(this.getAttribute("starting-index") ?? "1", 10);
      if (!isNaN(startingIndex) && startingIndex > 1) {
        requestAnimationFrame(() => this.goTo(startingIndex, "instant"));
      } else {
        this.#updateButtonStates();
        this.#updateStatus();
      }
    });

    const slot = this.shadowRoot?.querySelector("slot:not([name])");
    slot?.addEventListener("slotchange", this.#onSlotChange, { signal });
  }

  disconnectedCallback() {
    this.#abortController?.abort();
    this.#abortController = null;
    this.#intersectionObserver?.disconnect();
    this.#intersectionObserver = null;
    this.#resizeObserver?.disconnect();
    this.#resizeObserver = null;
    this.#clearEqualHeightImages();
    if (this.#equalHeightRaf) cancelAnimationFrame(this.#equalHeightRaf);
    if (this.#scrollEndTimer) clearTimeout(this.#scrollEndTimer);
    if (this.#programmaticClearTimer) clearTimeout(this.#programmaticClearTimer);
    this.#mediaQueries = [];
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
        if (newValue !== null) this.setAttribute("aria-label", newValue);
        else this.removeAttribute("aria-label");
        break;
      case "slides-per-view": {
        const n = parseFloat(newValue ?? "2");
        this.#defaultSlidesPerView = isNaN(n) ? 2 : n;
        if (!this.#activeBreakpointConfig()) {
          this.#slidesPerView = this.#defaultSlidesPerView;
          this.#applyTrackCSSVars();
          this.#updateButtonStates();
          this.#renderControlsRow();
          this.#scheduleEqualHeight();
        }
        break;
      }
      case "slides-per-group": {
        const n = parseInt(newValue ?? "1", 10);
        this.#defaultSlidesPerGroup = isNaN(n) ? 1 : n;
        if (!this.#activeBreakpointConfig()) {
          this.#slidesPerGroup = this.#defaultSlidesPerGroup;
          this.#renderControlsRow();
        }
        break;
      }
      case "gap":
        this.#defaultGap = newValue ?? "1rem";
        if (!this.#activeBreakpointConfig()) {
          this.#gap = this.#defaultGap;
          this.#applyTrackCSSVars();
        }
        break;
      case "breakpoints":
        this.#teardownBreakpoints();
        if (this.#abortController) this.#setupBreakpoints();
        break;
      case "pagination":
        this.#parsePagination(newValue);
        this.#applyPlacementAttributes();
        this.#renderControlsRow();
        break;
      case "controls":
        this.#parseControls(newValue);
        this.#applyPlacementAttributes();
        this.#renderControlsRow();
        break;
      case "equal-height":
        this.#equalHeight = this.#resolveEqualHeightMode(newValue);
        this.#applyEqualHeight();
        break;
      case "equal-height-samples":
        this.#equalHeightSamples = this.#resolveEqualHeightSamples(newValue);
        this.#applyEqualHeight();
        break;
    }
  }

  // --- Public API ---

  /** Move to the previous page. */
  prev() {
    if (this.#isAtStart) return;
    this.#goToPage(this.#currentPage - 1);
  }

  /** Move to the next page. */
  next() {
    if (this.#isAtEnd) return;
    this.#goToPage(this.#currentPage + 1);
  }

  /**
   * Jump to a specific 1-based slide index.
   * @param {number} index
   * @param {"smooth" | "instant"} [behavior="smooth"]
   */
  goTo(index, behavior = "smooth") {
    if (index < 1 || index > this.#maxSlideIndex) return;
    this.#currentSlide = index;
    this.#scrollToSlide(index, behavior);
    this.#afterNavigate();
  }

  /**
   * Navigate by page. Page is the source of truth for grouped navigation; the
   * slide index is derived from it, which keeps prev/next symmetric and makes
   * the last (possibly partial) page land exactly on #maxSlideIndex.
   * @param {number} page
   * @param {"smooth" | "instant"} [behavior="smooth"]
   */
  #goToPage(page, behavior = "smooth") {
    const clamped = Math.min(this.#totalPages - 1, Math.max(0, page));
    this.#currentSlide = this.#slideForPage(clamped);
    this.#scrollToSlide(this.#currentSlide, behavior);
    this.#afterNavigate();
  }

  /**
   * The 1-based slide index a page starts at, clamped so the final page lands on
   * the last reachable position rather than overshooting past the end.
   * @param {number} page
   * @returns {number}
   */
  #slideForPage(page) {
    if (page >= this.#totalPages - 1) return this.#maxSlideIndex;
    return Math.min(this.#maxSlideIndex, page * this.#slidesPerGroup + 1);
  }

  /** @returns {number} */
  get currentSlide() { return this.#currentSlide; }
  /** @returns {number} */
  get totalSlides() { return this.#totalSlides; }

  // --- Derived ---

  /** @returns {boolean} */
  get #isAtStart() { return this.#currentPage <= 0; }
  /** @returns {boolean} */
  get #isAtEnd() { return this.#currentPage >= this.#totalPages - 1; }
  /** @returns {number} */
  get #maxSlideIndex() {
    return Math.max(1, Math.floor(this.#totalSlides - this.#slidesPerView + 1));
  }
  /** @returns {number} */
  get #totalPages() {
    return Math.max(
      1,
      Math.ceil((this.#totalSlides - this.#slidesPerView) / this.#slidesPerGroup) + 1
    );
  }
  /** @returns {number} */
  get #currentPage() {
    // Derived from the slide position so it stays correct after user swipes
    // (which set #currentSlide directly). The last reachable slide maps to the
    // last page even when the final group is partial.
    if (this.#currentSlide >= this.#maxSlideIndex) {
      return this.#totalPages - 1;
    }
    return Math.min(
      this.#totalPages - 1,
      Math.max(0, Math.round((this.#currentSlide - 1) / this.#slidesPerGroup))
    );
  }
  /** @returns {boolean} */
  get #grouped() {
    return (this.#controls?.mode ?? "inline") === "grouped";
  }

  #afterNavigate() {
    this.#updateButtonStates();
    this.#updateStatus();
    this.#updateControlsRowState();
  }

  // --- Config parsing ---

  /** @param {string | null} raw */
  #parsePagination(raw) {
    if (raw === "false") { this.#pagination = null; return; }
    if (raw === null || raw === "" || raw === "true") { this.#pagination = {}; return; }
    try {
      this.#pagination = JSON.parse(raw);
    } catch {
      console.warn("wcag-ui-carousel: invalid JSON in pagination attribute.");
      this.#pagination = {};
    }
  }

  /** @param {string | null} raw */
  #parseControls(raw) {
    if (raw === "false") { this.#controls = null; return; }
    if (raw === null || raw === "" || raw === "true") { this.#controls = {}; return; }
    try {
      this.#controls = JSON.parse(raw);
    } catch {
      console.warn("wcag-ui-carousel: invalid JSON in controls attribute.");
      this.#controls = {};
    }
  }

  /** @returns {PaginationVariant} */
  #resolvedPaginationVariant() {
    return this.#pagination?.variant ?? "dots";
  }
  /** @returns {boolean} */
  #resolvedDynamicDots() {
    return this.#pagination?.dynamicDots ?? true;
  }
  /** @returns {Required<PaginationPlacement>} */
  #resolvedPlacement() {
    /** @type {Required<PaginationPlacement>} */
    const fallback = { vertical: "bottom", horizontal: "center", overlay: false };
    const src = this.#grouped ? this.#controls?.placement : this.#pagination?.placement;
    return { ...fallback, ...src };
  }
  /** @returns {ControlsMode} */
  #resolvedControlsMode() {
    return this.#controls?.mode ?? "inline";
  }
  /** @returns {ControlsVertical} */
  #resolvedControlsVertical() {
    return this.#controls?.vertical ?? "center";
  }
  /** @returns {string} */
  #resolvedControlsInset() {
    return this.#controls?.inset ?? "var(--wcag-ui-carousel-controls-gap)";
  }
  /** @returns {boolean} */
  #resolvedPersistent() {
    if (this.#grouped) return true;
    return this.#controls?.persistent ?? false;
  }
  /** @returns {boolean} */
  #resolvedHoverReveal() {
    if (this.#grouped) return false;
    return this.#controls?.hoverReveal ?? true;
  }

  // --- Placement / mode -> host data attributes (drive the CSS) ---

  #applyPlacementAttributes() {
    const controlsOff = this.#controls === null;
    const mode = controlsOff ? "none" : this.#resolvedControlsMode();
    const placement = this.#resolvedPlacement();

    this.#toggleAttr("data-controls-mode", controlsOff ? null : mode);
    this.#toggleAttr("data-controls-vertical", controlsOff ? null : this.#resolvedControlsVertical());
    this.#toggleAttr("data-controls-persistent", this.#resolvedPersistent() ? "" : null);
    this.#toggleAttr("data-controls-hover-reveal", this.#resolvedHoverReveal() ? "" : null);
    this.#toggleAttr("data-pagination-vertical", placement.vertical);
    this.#toggleAttr("data-pagination-horizontal", placement.horizontal);
    this.#toggleAttr("data-pagination-overlay", placement.overlay ? "" : null);

    this.style.setProperty("--wcag-ui-carousel-controls-inset", this.#resolvedControlsInset());

    this.#applyDefaultIcons();
  }

  /**
   * @param {string} name
   * @param {string | null} value
   */
  #toggleAttr(name, value) {
    if (value === null) this.removeAttribute(name);
    else this.setAttribute(name, value);
  }

  #applyDefaultIcons() {
    // Only swap the *default* (unslotted) icon markup. If the consumer slotted
    // an icon, it wins and we leave it alone.
    const grouped = this.#grouped;
    const prevSvg = this.shadowRoot?.querySelector(".button--prev .icon-prev");
    const nextSvg = this.shadowRoot?.querySelector(".button--next .icon-next");
    if (prevSvg) prevSvg.innerHTML = grouped ? PREV_ICON_GROUPED : PREV_ICON_STD;
    if (nextSvg) nextSvg.innerHTML = grouped ? NEXT_ICON_GROUPED : NEXT_ICON_STD;
  }

  // --- Controls row rendering ---

  #renderControlsRow() {
    const row = this.#controlsRow;
    if (!row) return;

    const paginationOn = this.#pagination !== null;
    const grouped = this.#grouped;
    const showRow = paginationOn || grouped;

    row.hidden = !showRow;
    if (!showRow) {
      row.replaceChildren();
      this.#dotIndicator = null;
      this.#fraction = null;
      this.#groupedPrev = null;
      this.#groupedNext = null;
      return;
    }

    row.replaceChildren();
    this.#dotIndicator = null;
    this.#fraction = null;
    this.#groupedPrev = null;
    this.#groupedNext = null;

    if (grouped) {
      this.#groupedPrev = this.#makeGroupedButton("prev");
      row.appendChild(this.#groupedPrev);
    }

    if (paginationOn) {
      row.appendChild(this.#makePaginationBody());
    }

    if (grouped) {
      this.#groupedNext = this.#makeGroupedButton("next");
      row.appendChild(this.#groupedNext);
    }

    this.#updateControlsRowState();
  }

  /**
   * @param {"prev" | "next"} dir
   * @returns {HTMLButtonElement}
   */
  #makeGroupedButton(dir) {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = `button button--${dir}`;
    btn.setAttribute("aria-label", dir === "prev" ? "Previous slide" : "Next slide");
    btn.setAttribute("aria-controls", this.#trackId);
    btn.setAttribute("part", `button button-${dir}`);

    const slotted = this.querySelector(`[slot="${dir}-icon"]`);
    if (slotted) {
      btn.appendChild(slotted.cloneNode(true));
    } else {
      const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
      svg.setAttribute("viewBox", "0 0 24 24");
      svg.setAttribute("width", "24");
      svg.setAttribute("height", "24");
      svg.setAttribute("aria-hidden", "true");
      svg.setAttribute("fill", "currentColor");
      svg.innerHTML = dir === "prev" ? PREV_ICON_GROUPED : NEXT_ICON_GROUPED;
      btn.appendChild(svg);
    }

    btn.addEventListener("click", () => (dir === "prev" ? this.prev() : this.next()));
    return btn;
  }

  /** @returns {HTMLElement} */
  #makePaginationBody() {
    const variant = this.#resolvedPaginationVariant();
    if (variant === "fraction") {
      const el = document.createElement("div");
      el.className = "fraction";
      el.setAttribute("aria-hidden", "true");
      this.#fraction = el;
      this.#updateFraction();
      return el;
    }
    const wrap = document.createElement("div");
    wrap.className = "dots";
    const dots = document.createElement("wcag-ui-dot-indicator");
    dots.setAttribute("color", "dark");
    dots.setAttribute("active-shape", variant === "pill" ? "pill" : "dot");
    if (!this.#resolvedDynamicDots()) dots.setAttribute("dynamic", "false");
    dots.setAttribute("count", String(this.#totalPages));
    dots.setAttribute("active-index", String(this.#currentPage));
    this.#dotIndicator = dots;
    wrap.appendChild(dots);
    return wrap;
  }

  #updateFraction() {
    if (this.#fraction) {
      this.#fraction.textContent = `${this.#currentPage + 1} / ${this.#totalPages}`;
    }
  }

  #updateControlsRowState() {
    if (this.#dotIndicator) {
      this.#dotIndicator.setAttribute("count", String(this.#totalPages));
      this.#dotIndicator.setAttribute("active-index", String(this.#currentPage));
    }
    this.#updateFraction();
    if (this.#groupedPrev) this.#groupedPrev.disabled = this.#isAtStart;
    if (this.#groupedNext) this.#groupedNext.disabled = this.#isAtEnd;
  }

  // --- Slides ---

  /** @returns {HTMLElement[]} */
  #slideItems() {
    return /** @type {HTMLElement[]} */ (
      Array.from(this.children).filter(
        (el) => el.tagName.toLowerCase() === "wcag-ui-carousel-item"
      )
    );
  }

  #indexSlides() {
    const items = this.#slideItems();
    this.#totalSlides = items.length;
    items.forEach((item, i) => {
      /** @type {any} */ (item).setSlidePosition?.(i + 1, this.#totalSlides);
    });
    this.#updateButtonStates();
    this.#updateStatus();
    this.#updateControlsRowState();
  }

  /**
   * @param {number} slideIndex
   * @param {ScrollBehavior} [behavior="smooth"]
   */
  #scrollToSlide(slideIndex, behavior = "smooth") {
    if (!this.#track) return;
    const items = this.#slideItems();
    const target = items[slideIndex - 1];
    if (!target) return;
    // Mark this as a programmatic scroll toward slideIndex.
    this.#programmaticTarget = slideIndex;
    // Safety net: a no-movement scroll (already at target) fires no scrollend,
    // which would leave the guard stuck. Clear it after the animation window.
    if (this.#programmaticClearTimer) clearTimeout(this.#programmaticClearTimer);
    this.#programmaticClearTimer = window.setTimeout(() => {
      this.#programmaticTarget = -1;
      this.#programmaticClearTimer = 0;
    }, 600);
    if (slideIndex >= this.#maxSlideIndex) {
      this.#track.scrollTo({ left: this.#track.scrollWidth, behavior });
      return;
    }
    this.#track.scrollTo({ left: target.offsetLeft, behavior });
  }

  #updateButtonStates() {
    if (this.#prevButton) this.#prevButton.disabled = this.#isAtStart;
    if (this.#nextButton) this.#nextButton.disabled = this.#isAtEnd;
  }

  #updateStatus() {
    if (this.#status) {
      this.#status.textContent = `Slide ${this.#currentSlide} of ${this.#totalSlides}`;
    }
  }

  #applyTrackCSSVars() {
    this.style.setProperty("--wcag-ui-carousel-slides-per-view", String(this.#slidesPerView));
    this.style.setProperty("--wcag-ui-carousel-space-between", this.#gap);
  }

  #setupIntersectionObserver() {
    this.#intersectionObserver?.disconnect();
    this.#intersectionObserver = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.intersectionRatio < 0.1) entry.target.setAttribute("aria-hidden", "true");
          else entry.target.removeAttribute("aria-hidden");
        }
      },
      { root: this.#track, threshold: [0, 0.1] }
    );
    for (const item of this.#slideItems()) this.#intersectionObserver.observe(item);
  }

  #setupResizeObserver() {
    if (typeof ResizeObserver === "undefined" || !this.#viewport) return;
    this.#resizeObserver?.disconnect();
    this.#resizeObserver = new ResizeObserver((entries) => {
      const width = entries[0]?.contentRect.width ?? NaN;
      if (width === this.#lastWidth) return;
      this.#lastWidth = width;
      this.#scheduleEqualHeight();
    });
    this.#resizeObserver.observe(this.#viewport);
  }

  // --- Breakpoints ---

  #setupBreakpoints() {
    if (!this.#abortController) return;
    const raw = this.getAttribute("breakpoints");
    if (!raw) return;
    let config;
    try { config = JSON.parse(raw); }
    catch { console.warn("wcag-ui-carousel: invalid JSON in breakpoints attribute."); return; }

    this.#mediaQueries = Object.entries(config)
      .map(([bp, cfg]) => ({ mql: window.matchMedia(`(min-width: ${bp}px)`), config: cfg }))
      .sort((a, b) => {
        const aW = parseInt(a.mql.media.match(/\d+/)?.[0] ?? "0", 10);
        const bW = parseInt(b.mql.media.match(/\d+/)?.[0] ?? "0", 10);
        return bW - aW;
      });

    const { signal } = this.#abortController;
    for (const { mql } of this.#mediaQueries) {
      mql.addEventListener("change", this.#onBreakpointChange, { signal });
    }
    this.#onBreakpointChange();
  }

  #teardownBreakpoints() {
    this.#mediaQueries = [];
    this.#slidesPerView = this.#defaultSlidesPerView;
    this.#slidesPerGroup = this.#defaultSlidesPerGroup;
    this.#gap = this.#defaultGap;
    if (this.#abortController) this.#applyTrackCSSVars();
  }

  /** @returns {BreakpointConfig | null} */
  #activeBreakpointConfig() {
    return this.#mediaQueries.find(({ mql }) => mql.matches)?.config ?? null;
  }

  #onBreakpointChange = () => {
    const matched = this.#activeBreakpointConfig();
    if (matched) {
      this.#slidesPerView = typeof matched.slidesPerView === "number"
        ? matched.slidesPerView
        : parseFloat(String(matched.slidesPerView ?? this.#defaultSlidesPerView));
      this.#slidesPerGroup = typeof matched.slidesPerGroup === "number"
        ? matched.slidesPerGroup
        : parseInt(String(matched.slidesPerGroup ?? this.#defaultSlidesPerGroup), 10);
      this.#gap = matched.gap ?? this.#defaultGap;
    } else {
      this.#slidesPerView = this.#defaultSlidesPerView;
      this.#slidesPerGroup = this.#defaultSlidesPerGroup;
      this.#gap = this.#defaultGap;
    }
    this.#applyTrackCSSVars();
    this.#updateButtonStates();
    this.#renderControlsRow();
    this.#scheduleEqualHeight();
  };

  // --- Equal height ---

  /**
   * @param {string | null} raw
   * @returns {string}
   */
  #resolveEqualHeightMode(raw) {
    if (raw === null) return "";
    const v = raw.trim().toLowerCase();
    if (v === "" || v === "auto") return v === "" ? "" : "auto";
    if (v === "uniform") return "uniform";
    return raw.trim();
  }

  /**
   * @param {string | null} raw
   * @returns {number}
   */
  #resolveEqualHeightSamples(raw) {
    if (raw === null) return NaN;
    const n = parseInt(raw, 10);
    return Number.isFinite(n) && n > 0 ? n : NaN;
  }

  /** @returns {number} */
  #effectiveEqualHeightSamples() {
    const base = Number.isFinite(this.#equalHeightSamples)
      ? this.#equalHeightSamples
      : Math.ceil(this.#slidesPerView);
    return Math.max(1, Math.min(base, this.#totalSlides));
  }

  /** @param {string | null} px */
  #setSlideHeights(px) {
    for (const item of this.#slideItems()) {
      if (px === null) item.style.removeProperty("height");
      else item.style.height = px;
    }
  }

  #applyEqualHeight = () => {
    const mode = this.#equalHeight;
    if (mode !== "uniform") this.#clearEqualHeightImages();
    if (!this.#track) return;

    if (mode === "") { this.#setSlideHeights(null); return; }
    if (mode === "auto") { this.#setSlideHeights("auto"); return; }
    if (mode === "uniform") { this.#sampleLeadingImages(); this.#measureUniformHeight(); return; }
    this.#setSlideHeights(mode);
  };

  #scheduleEqualHeight() {
    if (this.#equalHeight !== "uniform") return;
    if (this.#equalHeightRaf) cancelAnimationFrame(this.#equalHeightRaf);
    this.#equalHeightRaf = requestAnimationFrame(() => {
      this.#equalHeightRaf = 0;
      this.#measureUniformHeight();
    });
  }

  #sampleLeadingImages() {
    this.#clearEqualHeightImages();
    const items = this.#slideItems();
    const n = this.#effectiveEqualHeightSamples();
    for (let i = 0; i < n && i < items.length; i++) {
      for (const img of items[i].querySelectorAll("img")) {
        this.#trackEqualHeightImage(/** @type {HTMLImageElement} */ (img));
      }
    }
  }

  /** @param {HTMLImageElement} img */
  #trackEqualHeightImage(img) {
    if (this.#equalHeightImages.has(img)) return;
    if (img.complete && img.naturalHeight > 0) return;
    this.#equalHeightImages.add(img);
    img.addEventListener("load", this.#onEqualHeightImageSettled, { once: true });
    img.addEventListener("error", this.#onEqualHeightImageSettled, { once: true });
    if (img.loading === "lazy") img.loading = "eager";
    if (typeof img.decode === "function") {
      img.decode().then(() => this.#scheduleEqualHeight(), () => {});
    }
  }

  /** @param {Event} e */
  #onEqualHeightImageSettled = (e) => {
    const img = /** @type {HTMLImageElement} */ (e.currentTarget);
    this.#equalHeightImages.delete(img);
    this.#scheduleEqualHeight();
  };

  #clearEqualHeightImages() {
    for (const img of this.#equalHeightImages) {
      img.removeEventListener("load", this.#onEqualHeightImageSettled);
      img.removeEventListener("error", this.#onEqualHeightImageSettled);
    }
    this.#equalHeightImages.clear();
  }

  #measureUniformHeight() {
    if (this.#equalHeight !== "uniform") return;
    const items = this.#slideItems();
    if (items.length === 0) return;
    for (const item of items) item.style.removeProperty("height");

    const n = this.#effectiveEqualHeightSamples();
    /** @type {number[]} */
    const heights = [];
    for (let i = 0; i < n && i < items.length; i++) {
      const h = items[i].getBoundingClientRect().height;
      if (h > 0) heights.push(h);
    }
    if (heights.length === 0) return;

    /** @type {Map<number, number>} */
    const counts = new Map();
    for (const h of heights) counts.set(h, (counts.get(h) ?? 0) + 1);

    const tallest = Math.max(...heights);
    let bestHeight = tallest;
    let bestCount = 0;
    let tie = false;
    for (const [h, count] of counts) {
      if (count > bestCount) { bestCount = count; bestHeight = h; tie = false; }
      else if (count === bestCount && h !== bestHeight) tie = true;
    }
    const chosen = bestCount <= 1 || tie ? tallest : bestHeight;
    this.#setSlideHeights(`${Math.ceil(chosen)}px`);
  }

  // --- Scroll settle ---

  #onScrollDebounced = () => {
    if (this.#scrollEndTimer) clearTimeout(this.#scrollEndTimer);
    this.#scrollEndTimer = window.setTimeout(this.#onScrollSettled, 120);
  };

  #onScrollSettled = () => {
    if (!this.#track) return;
    const items = this.#slideItems();
    if (items.length === 0) return;

    // Programmatic scroll in flight: #currentSlide was already set by the click
    // handler and is the source of truth. Don't overwrite it from a mid-flight
    // reading (that desyncs the dots). If the smooth scroll settled SHORT of the
    // target — which happens when rapid clicks restart the animation faster than
    // it completes — re-issue the scroll so the track finishes the trip.
    if (this.#programmaticTarget !== -1) {
      const landed = this.#nearestSlide();
      if (landed === this.#programmaticTarget) {
        this.#programmaticTarget = -1;
        if (this.#programmaticClearTimer) {
          clearTimeout(this.#programmaticClearTimer);
          this.#programmaticClearTimer = 0;
        }
      } else {
        this.#scrollToSlide(this.#programmaticTarget);
      }
      return;
    }

    // No programmatic scroll: user swipe/drag. Adopt the nearest settled slide.
    const newSlide = this.#nearestSlide();
    if (newSlide !== this.#currentSlide) {
      this.#currentSlide = newSlide;
      this.#updateButtonStates();
      this.#updateStatus();
      this.#updateControlsRowState();
    }
  };

  /**
   * The 1-based slide whose offsetLeft is closest to the current scrollLeft.
   * @returns {number}
   */
  #nearestSlide() {
    const track = this.#track;
    if (!track) return this.#currentSlide;
    const items = this.#slideItems();
    if (items.length === 0) return this.#currentSlide;
    const scrollLeft = track.scrollLeft;
    let nearest = 0;
    let nearestDistance = Infinity;
    items.forEach((item, i) => {
      const d = Math.abs(item.offsetLeft - scrollLeft);
      if (d < nearestDistance) { nearestDistance = d; nearest = i; }
    });
    return nearest + 1;
  }

  #onSlotChange = () => {
    customElements.whenDefined("wcag-ui-carousel-item").then(() => {
      this.#indexSlides();
      this.#setupIntersectionObserver();
      this.#renderControlsRow();
      this.#applyEqualHeight();
    });
  };
}

if (typeof customElements !== "undefined" && !customElements.get("wcag-ui-carousel")) {
  customElements.define("wcag-ui-carousel", WCAGUICarousel);
}
