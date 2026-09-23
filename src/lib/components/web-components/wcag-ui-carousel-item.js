export {};

/**
 * @param {TemplateStringsArray} strings
 * @param {any[]} values
 * @returns {string}
 */
const html = (strings, ...values) => String.raw(strings, ...values);

/**
 * wcag-ui-carousel-item
 *
 * A single slide. Registers its position with the parent carousel (which calls
 * setSlidePosition) and exposes itself for measurement/scroll via the
 * data-wcag-ui-carousel-slide attribute. The carousel sets an inline height on
 * this element directly when equal-height is active.
 */
class WCAGUICarouselItem extends HTMLElement {
	static #template = document.createElement("template");
	static {
		this.#template.innerHTML = html`
			<style>
				:host {
					position: relative;
					display: block;
					contain: content;
					scroll-snap-align: start;
					scroll-snap-stop: always;
					box-sizing: border-box;
				}
			</style>
			<slot></slot>
		`;
	}

	/** @type {number} */
	#position = 1;
	/** @type {number} */
	#total = 0;

	constructor() {
		super();
		const root = this.attachShadow({ mode: "open" });
		root.appendChild(WCAGUICarouselItem.#template.content.cloneNode(true));
	}

	connectedCallback() {
		this.setAttribute("role", "group");
		this.setAttribute("aria-roledescription", "slide");
		this.setAttribute("data-wcag-ui-carousel-slide", "");
		this.#updateLabel();
	}

	/**
	 * Called by the parent carousel during indexing.
	 * @param {number} position
	 * @param {number} total
	 */
	setSlidePosition(position, total) {
		this.#position = position;
		this.#total = total;
		this.#updateLabel();
	}

	#updateLabel() {
		this.setAttribute("aria-label", `${this.#position} of ${this.#total}`);
	}
}

if (
	typeof customElements !== "undefined" &&
	!customElements.get("wcag-ui-carousel-item")
) {
	customElements.define("wcag-ui-carousel-item", WCAGUICarouselItem);
}
