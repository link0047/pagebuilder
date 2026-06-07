export { };

class WCAGUICarouselItem extends HTMLElement {
  static #template = document.createElement("template");
  static {
    this.#template.innerHTML = `
      <style>
        :host {
          --wcag-ui-carousel-item-height: auto;
          --wcag-ui-carousel-item-aspect-ratio: ;
          --wcag-ui-carousel-item-slot-height: auto;

          display: block;
          position: relative;

          scroll-snap-align: start;
          scroll-snap-stop: always;
          transition: border-color .2s ease-in-out;
          height: var(--wcag-ui-carousel-item-height);
          aspect-ratio: var(--wcag-ui-carousel-item-aspect-ratio);

          @media (prefers-reduced-motion: reduce) {
            transition: none;
          }
        }

        ::slotted(*) {
          height: var(--wcag-ui-carousel-item-slot-height);
        }
      </style>
      <slot></slot>
    `;
  }

  /** @type {number} */
  #slideIndex = 0;

  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.shadowRoot?.appendChild(WCAGUICarouselItem.#template.content.cloneNode(true));
  }

  connectedCallback() {
    this.setAttribute("role", "group");
    this.setAttribute("aria-roledescription", "slide");
    this.dataset.wcagUiCarouselSlide = "";
  }

  /**
   * Called by the parent carousel to assign this item its 1-based position.
   * @param {number} index - 1-based slide index
   * @param {number} total - total number of slides
   */
  setSlidePosition(index, total) {
    this.#slideIndex = index;
    this.setAttribute("aria-label", `${index} of ${total}`);
  }

  get slideIndex() {
    return this.#slideIndex;
  }
}

if (typeof customElements !== "undefined" && !customElements.get("wcag-ui-carousel-item")) {
  customElements.define("wcag-ui-carousel-item", WCAGUICarouselItem);
}
