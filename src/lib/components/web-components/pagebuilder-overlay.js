export {};

class PageBuilderOverlay extends HTMLElement {
  static #template = document.createElement("template");
  static {
    this.#template.innerHTML = `
      <style>
        :host {
          position: fixed;
          pointer-events: none;
          z-index: 9999;
          top: 0;
          left: 0;
          display: none;
          box-sizing: border-box;
          overflow: visible;

          --overlay-border-width: 2.5px;
          --overlay-color: #007cf8;
          --overlay-height: 1.5rem;
          --label-top: calc(-1 * var(--overlay-height));
          --label-radius: .25rem .25rem 0 0;
        }

        :host([active]) {
          display: block;
        }

        .overlay__border {
          position: absolute;
          inset: 0;
          border: var(--overlay-border-width) solid var(--overlay-color);
          box-sizing: border-box;
          border-radius: 2px;
          overflow: visible;
        }

        .overlay__label {
          box-sizing: border-box;
          position: absolute;
          top: var(--label-top);
          left: calc(-1 * var(--overlay-border-width));
          background: var(--overlay-color);
          color: #fff;
          font-size: .75rem;
          height: var(--overlay-height);
          font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji";
          font-weight: 500;
          padding-inline: .5rem;
          white-space: nowrap;
          border-radius: var(--label-radius);
          display: flex;
          justify-content: center;
          align-items: center;
          gap: .5ch;
          line-height: 1;
        }

        :host([mode="selected"]) :is(.overlay__label, .overlay__border) {
          --overlay-color: #005bd3;
        }
      </style>
      <div class="overlay__border">
        <div class="overlay__label">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M20.71,4.04C21.1,3.65 21.1,3 20.71,2.63L18.37,0.29C18,-0.1 17.35,-0.1 16.96,0.29L15,2.25L18.75,6M0,17.25V21H3.75L14.81,9.94L11.06,6.19L0,17.25Z" />
          </svg>
          <span class="overlay__label-text"></span>
        </div>
      </div>
    `;
  }

  /** @type {AbortController | null} */
  #abortController = null;
  /** @type {string | null} */
  #hoveredPath = null;
  /** @type {string | null} */
  #selectedPath = null;
  /** @type {HTMLSpanElement | null} */
  #labelText = null;

  constructor() {
    super();
    const root = this.attachShadow({ mode: "open" });
    root.appendChild(PageBuilderOverlay.#template.content.cloneNode(true));
    this.#labelText = /** @type {HTMLSpanElement} */ (root.querySelector(".overlay__label-text"));
  }

  connectedCallback() {
    this.#abortController = new AbortController();
    const { signal } = this.#abortController;

    window.addEventListener("message", this.#onMessage, { signal });
    window.addEventListener("scroll", this.#reposition, { signal, passive: true });
    window.addEventListener("resize", this.#reposition, { signal, passive: true });
  }

  disconnectedCallback() {
    this.#abortController?.abort();
    this.#abortController = null;
  }

  #onMessage = (/** @type {MessageEvent} */ event) => {
    if (event.origin !== window.location.origin) return;

    if (event.data?.type === "preview-hover") {
      this.#hoveredPath = event.data.path ?? null;
      this.#update();
    }

    if (event.data?.type === "preview-select") {
      this.#selectedPath = event.data.path ?? null;
      this.#update();
    }
  };

  #update() {
    // selection takes priority over hover
    const activePath = this.#selectedPath ?? this.#hoveredPath;
    const mode = this.#selectedPath ? "selected" : "hover";

    if (!activePath) {
      this.removeAttribute("active");
      return;
    }

    const el = document.querySelector(`[data-component-path="${activePath}"]`);
    if (!el) {
      this.removeAttribute("active");
      return;
    }

    const rect = el.getBoundingClientRect();
    this.style.width = `${rect.width}px`;
    this.style.height = `${rect.height}px`;
    this.style.transform = `translate(${rect.left}px, ${rect.top}px)`;

    if (rect.top < 24) {
      this.style.setProperty("--label-top", "0");
      this.style.setProperty("--label-radius", "0 0 .25rem 0");
    } else {
      this.style.setProperty("--label-top", "calc(-1 * var(--overlay-height))");
      this.style.setProperty("--label-radius", ".25rem .25rem 0 0");
    }

    if (this.#labelText) {
      this.#labelText.textContent = (/** @type {HTMLElement} */ (el)).dataset.componentLabel ?? activePath;
    }

    this.setAttribute("mode", mode);
    this.setAttribute("active", "");
  }

  #reposition = () => {
    this.#update();
  };
}

if (typeof customElements !== "undefined" && !customElements.get("pagebuilder-overlay")) {
  customElements.define("pagebuilder-overlay", PageBuilderOverlay);
}
