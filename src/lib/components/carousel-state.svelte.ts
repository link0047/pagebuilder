import { getContext, setContext } from "svelte";

const CAROUSEL_KEY = Symbol("CAROUSEL");

type Breakpoint = {
	slidesPerView?: number;
	slidesPerGroup?: number;
	spaceBetween?: string;
};

type CarouselOptions = {
	slidesPerView?: number;
	slidesPerGroup?: number;
	spaceBetween?: string;
	startingIndex?: number;
	breakpoints?: Record<string, Breakpoint>;
};

type CarouselScrollBehavior = "smooth" | "instant";

class CarouselState {
	static #id = 0;
	static START_INDEX = 1;

	#carouselId: string;
	#carouselTrackId: string;
	#trackElement: HTMLElement | null = null;
	#intersectionObserver: IntersectionObserver | null = null;
	#controller = new AbortController();
	#defaultOptions: {
		slidesPerView: number;
		slidesPerGroup: number;
		spaceBetween: string;
	};

	currentSlide = $state<number>(CarouselState.START_INDEX);
	totalSlides = $state<number>(0);
	#slideCount = 0;

	slidesPerView = $state<number>(2);
	slidesPerGroup = $state<number>(1);
	spaceBetween = $state<string>("1rem");

	isAtStart = $derived(this.currentSlide <= 1);
	isAtEnd = $derived(this.currentSlide >= this.totalSlides - this.slidesPerView + 1);

	constructor(options: CarouselOptions = {}) {
		const {
			slidesPerView = 2,
			slidesPerGroup = 1,
			spaceBetween = "1rem",
			startingIndex,
			breakpoints
		} = options;

		this.#carouselId = `uikit-carousel-${CarouselState.#id++}`;
		this.#carouselTrackId = `${this.#carouselId}-track`;

		this.#defaultOptions = {
			slidesPerView,
			slidesPerGroup,
			spaceBetween
		};

		this.slidesPerView = slidesPerView;
		this.slidesPerGroup = slidesPerGroup;
		this.spaceBetween = spaceBetween;
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
    const track = this.#trackElement;

		this.#trackElement.addEventListener("scrollend", () => {
			const scrollLeft = track.scrollLeft;
			const slideWidth = track.scrollWidth / this.totalSlides;
			const newSlide = Math.round(scrollLeft / slideWidth) + 1;
			this.currentSlide = newSlide;
		}, { signal });
		this.#setupIntersectionObserver();
	}

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

	  this.#trackElement?.querySelectorAll("[data-uikit-carousel-slide]").forEach(slide => {
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
				this.spaceBetween = matched.config.spaceBetween ?? this.#defaultOptions.spaceBetween;
			} else {
				// Reset to defaults
				this.slidesPerView = this.#defaultOptions.slidesPerView;
				this.slidesPerGroup = this.#defaultOptions.slidesPerGroup;
				this.spaceBetween = this.#defaultOptions.spaceBetween;
			}
		};

		updateBreakpoint();

		mediaQueries.forEach(({ mql }) => {
			mql.addEventListener('change', updateBreakpoint, { signal: this.#controller.signal });
		});
	}

	#scrollToSlide(slideIndex: number, behavior: CarouselScrollBehavior = "smooth") {
		if (!this.#trackElement) return;

		const slideWidth = this.#trackElement.scrollWidth / this.totalSlides;
		const scrollPosition = (slideIndex - CarouselState.START_INDEX) * slideWidth;

		this.#trackElement.scrollTo({
			left: scrollPosition,
			behavior
		});
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
				this.totalSlides - this.slidesPerView + 1,
				this.currentSlide + this.slidesPerGroup
			);
			this.#scrollToSlide(this.currentSlide);
		}
	}

	goTo(index: number, behavior: CarouselScrollBehavior = "smooth") {
		const minIndex = CarouselState.START_INDEX;
		const maxIndex = this.totalSlides - this.slidesPerView + 1;
		if (index >= minIndex && index <= maxIndex) {
			this.currentSlide = index;
			if (this.#trackElement) {
				this.#scrollToSlide(index, behavior);
			}
		}
	}

	destroy() {
		this.#controller.abort();
		this.#intersectionObserver?.disconnect();
	}
}

export function setCarouselState(options?: CarouselOptions) {
	return setContext(CAROUSEL_KEY, new CarouselState(options));
}

export function getCarouselState(): CarouselState {
	return getContext(CAROUSEL_KEY);
}

export type { CarouselOptions, Breakpoint };
