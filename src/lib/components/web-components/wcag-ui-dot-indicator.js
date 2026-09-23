export {};

/**
 * @param {TemplateStringsArray} strings
 * @param {any[]} values
 * @returns {string}
 */
const html = (strings, ...values) => String.raw(strings, ...values);

/**
 * @typedef {"sm" | "md" | "lg"} Size
 * @typedef {"dot" | "pill"} ActiveShape
 * @typedef {"default" | "light" | "dark"} Color
 * @typedef {{ r: number, gap: number, padding: number, pillW: number }} SizePreset
 * @typedef {{ scales: number[], startGlobal: number, startSlot: number }} DotLayout
 * @typedef {{ g: SVGGElement, dot: SVGCircleElement, pill: SVGRectElement }} DotSlot
 */

/**
 * wcag-ui-dot-indicator
 *
 * A carousel page indicator: a row of dots with one active, optionally morphing
 * the active dot into a pill. Above a threshold it "windows" — showing a fixed
 * set of dots that shrink toward the edges (Instagram-style) — unless dynamic is
 * turned off.
 *
 * Attributes:
 *   count         {number}  - total number of dots                    (default: 0)
 *   active-index  {number}  - 0-based active dot                       (default: 0)
 *   gap           {number}  - px gap between dots (overrides preset)   (default: preset)
 *   color         {string}  - "default" | "light" | "dark"            (default: "default")
 *   size          {string}  - "sm" | "md" | "lg"                       (default: "md")
 *   active-shape  {string}  - "dot" | "pill"                           (default: "dot")
 *   dynamic       {boolean} - window large counts (presence attribute) (default: true)
 *
 * CSS custom properties:
 *   --wcag-ui-dot-fill            inactive dot fill
 *   --wcag-ui-dot-fill-active     active dot / pill fill
 *   --wcag-ui-dot-duration        transition duration      (default: .35s)
 *   --wcag-ui-dot-ease            transition easing
 */
class WCAGUIDotIndicator extends HTMLElement {
	static #template = document.createElement("template");
	static {
		this.#template.innerHTML = html`
			<style>
				:host {
					--wcag-ui-dot-bg: transparent;
					--wcag-ui-dot-height: 2rem;
					--wcag-ui-dot-border-radius: 999px;
					--wcag-ui-dot-fill: rgba(255, 255, 255, 0.5);
					--wcag-ui-dot-fill-active: #fff;
					--wcag-ui-dot-duration: 0.35s;
					--wcag-ui-dot-ease: cubic-bezier(0.4, 0, 0.2, 1);

					display: inline-flex;
					align-items: center;
					background: var(--wcag-ui-dot-bg);
					height: var(--wcag-ui-dot-height);
					border-radius: var(--wcag-ui-dot-border-radius);
				}

				:host([color="light"]) {
					--wcag-ui-dot-fill: rgba(255, 255, 255, 0.5);
					--wcag-ui-dot-fill-active: #fff;
				}

				:host([color="dark"]) {
					--wcag-ui-dot-fill: rgba(0, 0, 0, 0.3);
					--wcag-ui-dot-fill-active: #000;
				}

				svg {
					display: block;
					overflow: visible;
				}

				.track {
					transition: transform var(--wcag-ui-dot-duration) var(--wcag-ui-dot-ease);
					will-change: transform;
				}

				.slot {
					transition: transform var(--wcag-ui-dot-duration) var(--wcag-ui-dot-ease);
				}

				.dot {
					fill: var(--wcag-ui-dot-fill);
					mix-blend-mode: difference;
					transform-box: fill-box;
					transform-origin: center;
					transition:
						transform var(--wcag-ui-dot-duration) var(--wcag-ui-dot-ease),
						fill 0.3s ease;
				}

				.pill {
					fill: var(--wcag-ui-dot-fill-active);
					mix-blend-mode: difference;
					transform-box: fill-box;
					transform-origin: left center;
					transition:
						transform var(--wcag-ui-dot-duration) var(--wcag-ui-dot-ease),
						opacity var(--wcag-ui-dot-duration) var(--wcag-ui-dot-ease);
				}

				.slot--active .dot {
					fill: var(--wcag-ui-dot-fill-active);
				}

				:host([color="light"]) .dot,
				:host([color="light"]) .pill,
				:host([color="dark"]) .dot,
				:host([color="dark"]) .pill {
					mix-blend-mode: normal;
				}

				@media (prefers-reduced-motion: reduce) {
					.track, .slot, .dot, .pill { transition: none; }
				}
			</style>
			<svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg">
				<g class="track"></g>
			</svg>
		`;
	}

	static get observedAttributes() {
		return ["count", "active-index", "gap", "color", "size", "active-shape", "dynamic"];
	}

	/** @type {Record<Size, SizePreset>} */
	static #SIZE_SCALE = {
		sm: { r: 3, gap: 6, padding: 8, pillW: 14 },
		md: { r: 4, gap: 8, padding: 10, pillW: 18 },
		lg: { r: 5, gap: 10, padding: 12, pillW: 24 },
	};

	static #LINEAR_THRESHOLD = 10;
	static #VISIBLE_SLOTS = 7;
	static #HEIGHT = 32;
	static #MD_SCALE = 0.7;
	static #SM_SCALE = 0.45;

	/** @type {SVGSVGElement} */
	#svg;
	/** @type {SVGGElement} */
	#track;
	/**
	 * Persistent per-dot node refs so we mutate transforms (keeping CSS
	 * transitions) instead of rebuilding the DOM each render.
	 * @type {DotSlot[]}
	 */
	#slots = [];
	/** @type {number} */
	#renderedCount = -1;

	constructor() {
		super();
		const root = this.attachShadow({ mode: "open" });
		root.appendChild(WCAGUIDotIndicator.#template.content.cloneNode(true));
		this.#svg = /** @type {SVGSVGElement} */ (root.querySelector("svg"));
		this.#track = /** @type {SVGGElement} */ (root.querySelector(".track"));
	}

	connectedCallback() {
		this.#render();
	}

	attributeChangedCallback() {
		this.#render();
	}

	// --- Attribute-derived values ---

	/** @returns {number} */
	get #count() {
		return Math.max(0, parseInt(this.getAttribute("count") ?? "0", 10) || 0);
	}
	/** @returns {number} */
	get #activeIndex() {
		return Math.max(0, parseInt(this.getAttribute("active-index") ?? "0", 10) || 0);
	}
	/** @returns {Size} */
	get #size() {
		const s = this.getAttribute("size");
		return s === "sm" || s === "lg" ? s : "md";
	}
	/** @returns {ActiveShape} */
	get #activeShape() {
		return this.getAttribute("active-shape") === "pill" ? "pill" : "dot";
	}
	/** @returns {boolean} */
	get #dynamic() {
		// Absent attribute -> default true; dynamic="false" -> false.
		const v = this.getAttribute("dynamic");
		return v === null ? true : v !== "false";
	}

	/** @returns {SizePreset} */
	get #preset() {
		return WCAGUIDotIndicator.#SIZE_SCALE[this.#size];
	}
	/** @returns {number} */
	get #r() {
		return this.#preset.r;
	}
	/** @returns {number} */
	get #gap() {
		const raw = this.getAttribute("gap");
		const n = raw === null ? NaN : parseFloat(raw);
		return Number.isFinite(n) ? n : this.#preset.gap;
	}
	/** @returns {number} */
	get #padding() {
		return this.#preset.padding;
	}
	/** @returns {number} */
	get #pillW() {
		return this.#preset.pillW;
	}
	/** @returns {number} */
	get #dotWidth() {
		return this.#r * 2;
	}
	/** @returns {number} */
	get #stride() {
		return this.#dotWidth + this.#gap;
	}
	/** @returns {number} */
	get #pillExtra() {
		return this.#activeShape === "pill" ? Math.max(0, this.#pillW - this.#dotWidth) : 0;
	}
	/** @returns {boolean} */
	get #useLinear() {
		return !this.#dynamic || this.#count < WCAGUIDotIndicator.#LINEAR_THRESHOLD;
	}

	// --- Layout math (ported verbatim from the Svelte version) ---

	/** @returns {DotLayout} */
	#layout() {
		const count = this.#count;
		const activeIndex = this.#activeIndex;
		const MD = WCAGUIDotIndicator.#MD_SCALE;
		const SM = WCAGUIDotIndicator.#SM_SCALE;

		if (this.#useLinear) {
			return { scales: Array(count).fill(1), startGlobal: 0, startSlot: 0 };
		}

		if (activeIndex <= 2) {
			return { scales: [1, 1, 1, MD, SM], startGlobal: 0, startSlot: 2 };
		} else if (activeIndex === 3) {
			return { scales: [MD, 1, 1, 1, MD, SM], startGlobal: 0, startSlot: 1 };
		} else if (activeIndex >= count - 2) {
			return { scales: [SM, MD, 1, 1, 1], startGlobal: count - 5, startSlot: 0 };
		} else if (activeIndex === count - 3) {
			return { scales: [SM, MD, 1, 1, 1, MD], startGlobal: count - 6, startSlot: 0 };
		}
		return { scales: [SM, MD, 1, 1, 1, MD, SM], startGlobal: activeIndex - 3, startSlot: 0 };
	}

	/**
	 * @param {number} slot
	 * @returns {number}
	 */
	#slotBaseX(slot) {
		return this.#padding + this.#r + slot * this.#stride;
	}

	/** @returns {number} */
	#trackWidth() {
		const VISIBLE_SLOTS = WCAGUIDotIndicator.#VISIBLE_SLOTS;
		const count = this.#count;
		const base = this.#useLinear
			? count * this.#dotWidth + Math.max(0, count - 1) * this.#gap + this.#padding * 2
			: VISIBLE_SLOTS * this.#dotWidth +
			  (VISIBLE_SLOTS - 1) * this.#gap +
			  this.#padding * 2;
		return base + this.#pillExtra;
	}

	// --- Rendering ---

	/**
	 * Build the dot nodes once for a given count; reused across renders.
	 * @param {number} count
	 */
	#buildDots(count) {
		this.#track.replaceChildren();
		this.#slots = [];
		const NS = "http://www.w3.org/2000/svg";
		const r = this.#r;
		const centerY = WCAGUIDotIndicator.#HEIGHT / 2;

		for (let i = 0; i < count; i++) {
			const g = document.createElementNS(NS, "g");
			g.setAttribute("class", "slot");

			const dot = document.createElementNS(NS, "circle");
			dot.setAttribute("class", "dot");
			dot.setAttribute("cx", "0");
			dot.setAttribute("cy", String(centerY));
			dot.setAttribute("r", String(r));

			const pill = document.createElementNS(NS, "rect");
			pill.setAttribute("class", "pill");
			pill.setAttribute("x", String(-r));
			pill.setAttribute("y", String(centerY - r));
			pill.setAttribute("width", String(this.#pillW));
			pill.setAttribute("height", String(this.#dotWidth));
			pill.setAttribute("rx", String(r));

			g.append(dot, pill);
			this.#track.appendChild(g);
			this.#slots.push({ g, dot, pill });
		}
		this.#renderedCount = count;
	}

	#render() {
		const count = this.#count;

		// Below 2 dots there's nothing meaningful to show.
		if (count <= 1) {
			this.#track.replaceChildren();
			this.#slots = [];
			this.#renderedCount = 0;
			this.#svg.setAttribute("width", "0");
			this.#svg.setAttribute("height", String(WCAGUIDotIndicator.#HEIGHT));
			return;
		}

		if (count !== this.#renderedCount) {
			this.#buildDots(count);
		}

		const width = this.#trackWidth();
		const height = WCAGUIDotIndicator.#HEIGHT;
		this.#svg.setAttribute("width", String(width));
		this.#svg.setAttribute("height", String(height));
		this.#svg.setAttribute("viewBox", `0 0 ${width} ${height}`);

		const layout = this.#layout();
		const { startSlot, startGlobal, scales } = layout;
		const activeIndex = this.#activeIndex;
		const activeShape = this.#activeShape;
		const pillExtra = this.#pillExtra;
		const pillW = this.#pillW;
		const dotWidth = this.#dotWidth;
		const collapsedScaleX = pillW > 0 ? dotWidth / pillW : 0;

		const groupTranslateX = (startSlot - startGlobal) * this.#stride;
		this.#track.style.transform = `translateX(${groupTranslateX}px)`;

		for (let i = 0; i < this.#slots.length; i++) {
			const within = i >= startGlobal && i < startGlobal + scales.length;
			const s = within ? scales[i - startGlobal] : 0;

			const shift = activeShape === "pill" && i > activeIndex ? pillExtra : 0;
			const x = this.#slotBaseX(i) + shift;

			const isActive = i === activeIndex;
			const { g, dot, pill } = this.#slots[i];

			g.setAttribute("class", isActive ? "slot slot--active" : "slot");
			g.style.transform = `translateX(${x}px)`;
			dot.style.transform = `scale(${s})`;

			const rectScaleX = activeShape === "pill" && isActive ? 1 : collapsedScaleX;
			const rectOpacity = activeShape === "pill" && isActive ? 1 : 0;
			pill.style.transform = `scaleX(${rectScaleX})`;
			pill.style.opacity = String(rectOpacity);
		}
	}
}

if (typeof customElements !== "undefined" && !customElements.get("wcag-ui-dot-indicator")) {
	customElements.define("wcag-ui-dot-indicator", WCAGUIDotIndicator);
}
