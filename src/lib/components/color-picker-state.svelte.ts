class ColorPickerState {
	static nextId = 0;
	#colorValue = $state("#000");
	#instanceId: number;
	
	constructor(initialValue: unknown) {
		 this.#colorValue = initialValue ? String(initialValue) : "#000";
		this.#instanceId = ColorPickerState.nextId++;
	}
	
	get value() {
		return this.#colorValue;
	}

	set value(newValue: string) {
		this.#colorValue = newValue;
	}
	
	get id() {
		return `uikit-color-picker-${this.#instanceId}`;
	}
}

export function createColorPickerState(initialValue: unknown) {
	return new ColorPickerState(initialValue);
}