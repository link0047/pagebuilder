import { getContext, setContext } from "svelte";

const SEGMENTEDCONTROL_KEY = Symbol("SEGMENTEDCONTROL");

class SegmentedControlState {
	static headingId = 0;
	#selectedIndex = $state(0);
	#headingId = $state<string | null>(null);
  #buttons = $state<string[]>([]);
	#initialValue: string | undefined;
	
	constructor(initialValue: unknown) {
		this.#initialValue = initialValue?.toString();
	}

	get selectedIndex() {
		return this.#selectedIndex;
	}

	get selectedValue() {
		return this.#buttons[this.#selectedIndex];
	}

	get headingId(): string {
    // Generate only when first accessed
    if (!this.#headingId) {
      this.#headingId = `uikit-segmented-control-heading-${SegmentedControlState.headingId++}`;
    }
    return this.#headingId;
  }

	registerButton(value: string): number {
    if (typeof value !== "string") {
		  return -1;
	  }
    
		const index = this.#buttons.length;
		this.#buttons.push(value);

		// If this matches the initial value, select it
		if (this.#initialValue && value === this.#initialValue) {
			this.#selectedIndex = index;
		}
		
		return index;
	}

	unregisterButton(index: number) {
		this.#buttons.splice(index, 1);

		if (this.#selectedIndex >= this.#buttons.length) {
			this.#selectedIndex = Math.max(0, this.#buttons.length - 1);
		}
	}

	selectByValue(value: string) {
		const index = this.#buttons.indexOf(value);
		if (index !== -1) {
			this.#selectedIndex = index;
		}
	}

	selectButton(index: number) {
		if (index >= 0 && index < this.#buttons.length) {
			this.#selectedIndex = index;
		}
	}

	isSelected(index: number): boolean {
		return this.#selectedIndex === index;
	}
}

export function setSegmentedControlState(initialValue: unknown) {
  return setContext(SEGMENTEDCONTROL_KEY, new SegmentedControlState(initialValue));
}

export function getSegmentedControlState() {
  return getContext<SegmentedControlState>(SEGMENTEDCONTROL_KEY);
}