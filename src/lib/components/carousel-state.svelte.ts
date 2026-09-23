import { getContext, setContext } from "svelte";

const CAROUSEL_KEY = Symbol("CAROUSEL");
const SLIDE_SELECTOR = "[data-wcag-ui-carousel-slide]";

type Breakpoint = {
	slidesPerView?: number;
	slidesPerGroup?: number;
	gap?: string;
};

type CarouselOptions = {
	slidesPerView?: number;
	slidesPerGroup?: number;
	gap?: string;
	startingIndex?: number;
	breakpoints?: Record<string, Breakpoint>;
};

type CarouselScrollBehavior = "smooth" | "instant";

// "" (off) | "auto" | "uniform" | any CSS length (e.g. "300px").
type EqualHeightMode = string;

class CarouselState {
	static #id = 0;
	static START_INDEX = 1;
	// Fallback debounce for browsers without a reliable scrollend event.
	static #SCROLL_END_DELAY = 120;

	#carouselId: string;
	#carouselTrackId: string;
	#trackElement: HTMLElement | null = null;
	#intersectionObserver: IntersectionObserver | null = null;
	#controller = new AbortController();
	#supportsScrollEnd = typeof window !== "undefined" && "onscrollend" in window;
	#scrollEndTimer = 0;
	#defaultOptions: {
		slidesPerView: number;
		slidesPerGroup: number;
		gap: string;
	};

	// --- Equal height ---
	#equalHeight: EqualHeightMode = "";
	#equalHeightSamples = NaN; // NaN -> default to slidesPerView
	#equalHeightRaf = 0;
	#equalHeightImages = new Set<HTMLImageElement>();
	#resizeObserver: ResizeObserver | null = null;
	// Last observed container width; re-measure only when width changes, since
	// height changes are the *output* of measurement (avoids a feedback loop).
	#lastWidth = NaN;

	currentSlide = $state<number>(CarouselState.START_INDEX);
	totalSlides = $state<number>(0);
	#slideCount = 0;

	slidesPerView = $state<number>(2);
	slidesPerGroup = $state<number>(1);
  gap = $state<string>("1rem");
  totalPages = $derived(Math.max(0, Math.ceil((this.totalSlides - this.slidesPerView) / this.slidesPerGroup) + 1));
	currentPage = $derived(Math.min(this.totalPages - 1, Math.max(0, Math.round((this.currentSlide - 1) / this.slidesPerGroup))));

	// Highest index a slide can be the active (leftmost visible) one. Floored and
	// clamped so fractional slidesPerView and tiny slide counts stay valid.
	maxSlideIndex = $derived(
		Math.max(
			CarouselState.START_INDEX,
			Math.floor(this.totalSlides - this.slidesPerView + 1)
		)
	);

	isAtStart = $derived(this.currentSlide <= CarouselState.START_INDEX);
	isAtEnd = $derived(this.currentSlide >= this.maxSlideIndex);

	constructor(options: CarouselOptions = {}) {
		const {
			slidesPerView = 2,
			slidesPerGroup = 1,
			gap = "1rem",
			startingIndex,
			breakpoints
		} = options;

		this.#carouselId = `uikit-carousel-${CarouselState.#id++}`;
		this.#carouselTrackId = `${this.#carouselId}-track`;

		this.#defaultOptions = {
			slidesPerView,
			slidesPerGroup,
			gap
		};

		this.slidesPerView = slidesPerView;
		this.slidesPerGroup = slidesPerGroup;
		this.gap = gap;
		this.currentSlide = startingIndex ?? CarouselState.START_INDEX;

		if (breakpoints) {
			this.#setupBreakpoints(breakpoints);
		}
	}

	get id() {
		return this.#carouselId;
	}

	get trackId() {
		return this.#carouselTrackId;
	}

	/** The slide item elements, in document order. */
	#slideElements(): HTMLElement[] {
		if (!this.#trackElement) return [];
		return Array.from(
			this.#trackElement.querySelectorAll<HTMLElement>(SLIDE_SELECTOR)
		);
	}

	set trackElement(element: HTMLElement) {
		const isNewElement = this.#trackElement !== element;
    this.#trackElement = element;

    // Only restore position when element changes and we're not at start
    if (isNewElement && this.currentSlide > CarouselState.START_INDEX) {
      requestAnimationFrame(() => {
        this.goTo(this.currentSlide, "instant");
      });
    }

		const { signal } = this.#controller;

		if (this.#supportsScrollEnd) {
			this.#trackElement.addEventListener("scrollend", this.#onScrollSettled, { signal });
		} else {
			// Fallback: debounce scroll events and treat a quiet gap as scroll-end.
			this.#trackElement.addEventListener("scroll", this.#onScrollDebounced, {
				signal,
				passive: true
			});
		}
		this.#setupIntersectionObserver();
		this.#setupResizeObserver();
		// Track element (re)assigned — apply any pending equal-height mode.
		this.#applyEqualHeight();
	}

	#setupResizeObserver() {
		if (typeof ResizeObserver === "undefined") return;
		this.#resizeObserver?.disconnect();

		// Observe the viewport (the track's parent) rather than the track itself:
		// its width is independent of the slide heights we set, so watching it
		// can't feed back into itself.
		const viewport = this.#trackElement?.parentElement;
		if (!viewport) return;

		this.#resizeObserver = new ResizeObserver((entries) => {
			const width = entries[0]?.contentRect.width ?? NaN;
			// Only a width change alters column width / content reflow. Ignore
			// height-only changes — those are the result of our own measurement.
			if (width === this.#lastWidth) return;
			this.#lastWidth = width;
			this.#scheduleEqualHeight();
		});
		this.#resizeObserver.observe(viewport);
	}

	#onScrollDebounced = () => {
		if (this.#scrollEndTimer) clearTimeout(this.#scrollEndTimer);
		this.#scrollEndTimer = window.setTimeout(
			this.#onScrollSettled,
			CarouselState.#SCROLL_END_DELAY
		);
	};

	// Back-compute the active slide from actual element positions, so variable
	// slide widths and fractional slidesPerView resolve correctly.
	#onScrollSettled = () => {
		const track = this.#trackElement;
		if (!track) return;

		const slides = this.#slideElements();
		if (slides.length === 0) return;

		const scrollLeft = track.scrollLeft;
		let nearest = 0;
		let nearestDistance = Infinity;

		slides.forEach((slide, i) => {
			const distance = Math.abs(slide.offsetLeft - scrollLeft);
			if (distance < nearestDistance) {
				nearestDistance = distance;
				nearest = i;
			}
		});

		const newSlide = nearest + 1;
		if (newSlide !== this.currentSlide) {
			this.currentSlide = newSlide;
		}
	};

	#setupIntersectionObserver() {
		if (typeof window === "undefined") return;

	  this.#intersectionObserver = new IntersectionObserver((entries) => {
	    for (const entry of entries) {
	      const slide = entry.target as HTMLElement;

	      if (entry.intersectionRatio < 0.1) {
	        slide.setAttribute("aria-hidden", "true");
	      } else {
	        slide.removeAttribute("aria-hidden");
	      }
	    }
	  }, {
	    root: this.#trackElement,
	    threshold: [0, 0.1],
	  });

	  this.#trackElement?.querySelectorAll(SLIDE_SELECTOR).forEach(slide => {
	    this.#intersectionObserver!.observe(slide);
	  });
	}

	#setupBreakpoints(breakpoints: Record<string, Breakpoint>) {
		if (typeof window === "undefined") return;

		const mediaQueries = Object.entries(breakpoints)
			.map(([breakpoint, config]) => ({
				mql: window.matchMedia(`(min-width: ${breakpoint}px)`),
				config
			}))
			.sort((a, b) => {
				const aWidth = parseInt(a.mql.media.match(/\d+/)?.[0] || "0");
			  const bWidth = parseInt(b.mql.media.match(/\d+/)?.[0] || "0");
			  return bWidth - aWidth;
			});

		const updateBreakpoint = () => {
			const matched = mediaQueries.find(({ mql }) => mql.matches);

			if (matched) {
				this.slidesPerView = matched.config.slidesPerView ?? this.#defaultOptions.slidesPerView;
				this.slidesPerGroup = matched.config.slidesPerGroup ?? this.#defaultOptions.slidesPerGroup;
				this.gap = matched.config.gap ?? this.#defaultOptions.gap;
			} else {
				// Reset to defaults
				this.slidesPerView = this.#defaultOptions.slidesPerView;
				this.slidesPerGroup = this.#defaultOptions.slidesPerGroup;
				this.gap = this.#defaultOptions.gap;
			}
			// Column width changed -> uniform heights need re-measuring.
			this.#applyEqualHeight();
		};

		updateBreakpoint();

		mediaQueries.forEach(({ mql }) => {
			mql.addEventListener("change", updateBreakpoint, { signal: this.#controller.signal });
		});
	}

	// Scroll to a slide by its real offsetLeft rather than assuming uniform width.
	// The last reachable slide scrolls to the track end so the right edge aligns.
	#scrollToSlide(slideIndex: number, behavior: CarouselScrollBehavior = "smooth") {
		const track = this.#trackElement;
		if (!track) return;

		const slides = this.#slideElements();
		const target = slides[slideIndex - CarouselState.START_INDEX];
		if (!target) return;

		if (slideIndex >= this.maxSlideIndex) {
			track.scrollTo({ left: track.scrollWidth, behavior });
			return;
		}

		track.scrollTo({ left: target.offsetLeft, behavior });
	}

	registerSlide(): number {
		const index = this.#slideCount++;
		this.totalSlides = this.#slideCount;
		return index + 1;
	}

	prev() {
		if (!this.isAtStart && this.#trackElement) {
			this.currentSlide = Math.max(
				CarouselState.START_INDEX,
				this.currentSlide - this.slidesPerGroup
			);
			this.#scrollToSlide(this.currentSlide);
		}
	}

	next() {
		if (!this.isAtEnd && this.#trackElement) {
			this.currentSlide = Math.min(
				this.maxSlideIndex,
				this.currentSlide + this.slidesPerGroup
			);
			this.#scrollToSlide(this.currentSlide);
		}
	}

	goTo(index: number, behavior: CarouselScrollBehavior = "smooth") {
		if (index >= CarouselState.START_INDEX && index <= this.maxSlideIndex) {
			this.currentSlide = index;
			if (this.#trackElement) {
				this.#scrollToSlide(index, behavior);
			}
		}
	}

	// ---------------------------------------------------------------------------
	// Equal height
	// ---------------------------------------------------------------------------

	/**
	 * Public entry point. Called from the component whenever the mode, samples,
	 * slide count, or slidesPerView change.
	 *   ""        -> off (remove any forced height)
	 *   "auto"    -> every slide sizes to its natural height (no measuring)
	 *   "uniform" -> force-load the first N slides, measure, and apply the most
	 *                common height (fallback: tallest) to all slides
	 *   <length>  -> apply that fixed CSS length to all slides
	 */
	setEqualHeight(mode: EqualHeightMode | null | undefined, samples?: number) {
		this.#equalHeight = this.#resolveEqualHeightMode(mode);
		this.#equalHeightSamples =
			Number.isFinite(samples) && (samples as number) > 0 ? (samples as number) : NaN;
		this.#applyEqualHeight();
	}

	#resolveEqualHeightMode(raw: EqualHeightMode | null | undefined): EqualHeightMode {
		if (raw == null) return "";
		const v = String(raw).trim().toLowerCase();
		if (v === "" ) return "";
		if (v === "auto") return "auto";
		if (v === "uniform") return "uniform";
		return String(raw).trim(); // treat anything else as a CSS length
	}

	/** How many leading slides to force-load and measure for "uniform". */
	#effectiveEqualHeightSamples(): number {
		const base = Number.isFinite(this.#equalHeightSamples)
			? this.#equalHeightSamples
			: Math.ceil(this.slidesPerView);
		return Math.max(1, Math.min(base, this.totalSlides));
	}

	/** Set (or clear) an explicit inline height on every slide element. */
	#setSlideHeights(px: string | null) {
		const items = this.#slideElements();
		for (const item of items) {
			if (px === null) {
				item.style.removeProperty("height");
			} else {
				item.style.height = px;
			}
		}
	}

	#applyEqualHeight = () => {
		const mode = this.#equalHeight;

		if (mode !== "uniform") {
			this.#clearEqualHeightImages();
		}

		if (!this.#trackElement) return;

		if (mode === "") {
			this.#setSlideHeights(null);
			return;
		}

		if (mode === "auto") {
			// Natural height per slide: clear any forced height.
			this.#setSlideHeights("auto");
			return;
		}

		if (mode === "uniform") {
			this.#sampleLeadingImages();
			this.#measureUniformHeight();
			return;
		}

		// Explicit CSS length.
		this.#setSlideHeights(mode);
	};

	/** Batch measurement into a single rAF so bursts of image loads coalesce. */
	#scheduleEqualHeight() {
		if (this.#equalHeight !== "uniform") return;
		if (this.#equalHeightRaf) cancelAnimationFrame(this.#equalHeightRaf);
		this.#equalHeightRaf = requestAnimationFrame(() => {
			this.#equalHeightRaf = 0;
			this.#measureUniformHeight();
		});
	}

	/**
	 * Force-load images in the first N slides so their heights are known without
	 * the user scrolling. Off-screen loading="lazy" images in a scroll container
	 * may otherwise never fetch, which would make the measurement wrong until the
	 * user reached the end.
	 */
	#sampleLeadingImages() {
		this.#clearEqualHeightImages();

		const items = this.#slideElements();
		const n = this.#effectiveEqualHeightSamples();

		for (let i = 0; i < n && i < items.length; i++) {
			for (const img of items[i].querySelectorAll("img")) {
				this.#trackEqualHeightImage(img);
			}
		}
	}

	#trackEqualHeightImage(img: HTMLImageElement) {
		if (this.#equalHeightImages.has(img)) return;
		if (img.complete && img.naturalHeight > 0) return; // already usable

		this.#equalHeightImages.add(img);
		img.addEventListener("load", this.#onEqualHeightImageSettled, { once: true });
		img.addEventListener("error", this.#onEqualHeightImageSettled, { once: true });

		// Promote lazy sampled images to eager so the browser fetches them now.
		if (img.loading === "lazy") {
			img.loading = "eager";
		}
		if (typeof img.decode === "function") {
			img.decode().then(
				() => this.#scheduleEqualHeight(),
				() => {} // decode may reject pre-fetch; the load listener covers it
			);
		}
	}

	#onEqualHeightImageSettled = (e: Event) => {
		const img = e.currentTarget as HTMLImageElement;
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

	/**
	 * Measure the natural height of the first N item wrappers and apply the most
	 * common exact-px height to all slides. Ties or all-unique fall back to the
	 * tallest sampled height (clips less than smallest in the ambiguous case).
	 */
	#measureUniformHeight() {
		if (this.#equalHeight !== "uniform") return;

		const items = this.#slideElements();
		if (items.length === 0) return;

		// Release forced heights so items report their natural height.
		for (const item of items) item.style.removeProperty("height");

		const n = this.#effectiveEqualHeightSamples();
		const heights: number[] = [];
		for (let i = 0; i < n && i < items.length; i++) {
			const h = items[i].getBoundingClientRect().height;
			if (h > 0) heights.push(h);
		}
		if (heights.length === 0) return;

		// Tally exact-match occurrences.
		const counts = new Map<number, number>();
		for (const h of heights) counts.set(h, (counts.get(h) ?? 0) + 1);

		const tallest = Math.max(...heights);
		let bestHeight = tallest;
		let bestCount = 0;
		let tie = false;

		for (const [h, count] of counts) {
			if (count > bestCount) {
				bestCount = count;
				bestHeight = h;
				tie = false;
			} else if (count === bestCount && h !== bestHeight) {
				tie = true;
			}
		}

		// No clear winner (all unique -> every count 1 -> tie) falls back to tallest.
		const chosen = bestCount <= 1 || tie ? tallest : bestHeight;

		this.#setSlideHeights(`${Math.ceil(chosen)}px`);
	}

	destroy() {
		this.#controller.abort();
		this.#intersectionObserver?.disconnect();
		this.#resizeObserver?.disconnect();
		this.#clearEqualHeightImages();
		if (this.#scrollEndTimer) {
			clearTimeout(this.#scrollEndTimer);
			this.#scrollEndTimer = 0;
		}
		if (this.#equalHeightRaf) {
			cancelAnimationFrame(this.#equalHeightRaf);
			this.#equalHeightRaf = 0;
		}
	}
}

export function setCarouselState(options?: CarouselOptions) {
	return setContext(CAROUSEL_KEY, new CarouselState(options));
}

export function getCarouselState(): CarouselState {
	return getContext(CAROUSEL_KEY);
}

export type { CarouselOptions, Breakpoint };
