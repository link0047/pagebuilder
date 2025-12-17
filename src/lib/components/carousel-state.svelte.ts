import { getContext, setContext } from "svelte";

const CAROUSEL_KEY = Symbol("CAROUSEL");

type CarouselOptions = {
	slidesPerView?: number;
	startingIndex?: number;
};

type CarouselScrollBehavior = "smooth" | "instant";

class CarouselState {
	static #id = 0;
	static START_INDEX = 1;
	
	#carouselId: string;
	#carouselTrackId: string;
	#trackElement: HTMLElement | null = null;
	#slidesPerView: number = 1;
	
	currentSlide = $state<number>(CarouselState.START_INDEX);
	totalSlides = $state<number>(0);
	#slideCount = 0;

	isAtStart = $derived(this.currentSlide <= 1);
	isAtEnd = $derived(this.currentSlide >= this.totalSlides - this.#slidesPerView + 1);
	
	constructor(options: CarouselOptions = {}) {
		const { slidesPerView = 1, startingIndex } = options;
		
		this.#carouselId = `uikit-carousel-${CarouselState.#id++}`;
		this.#carouselTrackId = `${this.#carouselId}-track`;
		this.#slidesPerView = slidesPerView;
		this.currentSlide = startingIndex ?? CarouselState.START_INDEX;
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
	}

	registerSlide(): number {
		const index = this.#slideCount++;
		this.totalSlides = this.#slideCount;
		return index;
	}

	prev() {
		if (!this.isAtStart && this.#trackElement) {
			this.currentSlide--;
			this.#scrollToSlide(this.currentSlide);
		}
	}
	
	next() {
		if (!this.isAtEnd && this.#trackElement) {
			this.currentSlide++;
			this.#scrollToSlide(this.currentSlide);
		}
	}

	goTo(index: number, behavior: CarouselScrollBehavior = "smooth") {
		const minIndex = CarouselState.START_INDEX;
		const maxIndex = this.totalSlides - this.#slidesPerView + 1;
		if (index >= minIndex && index <= maxIndex) {
			this.currentSlide = index;
			if (this.#trackElement) {
				this.#scrollToSlide(index, behavior);
			}
		}
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
}

export function setCarouselState(options?: CarouselOptions) {
	return setContext(CAROUSEL_KEY, new CarouselState(options));
}

export function getCarouselState(): CarouselState {
	return getContext(CAROUSEL_KEY);
}

export type { CarouselOptions };