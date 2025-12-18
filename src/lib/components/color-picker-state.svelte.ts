type GetValue = () => string;
type SetValue = (newValue: string) => void;

export class ColorPickerState {
	static uid = 0;
	static HEX_PATTERN = /^#([0-9A-F]{3}|[0-9A-F]{6})$/i;
	
	#uid: number;
	#id: string;
	#textId: string;
	#colorId: string;
	#errorId: string;
	#getValue: GetValue;
	#setValue: SetValue;
	
	constructor(getValue: GetValue, setValue: SetValue) {
		this.#uid = ColorPickerState.uid++;
		this.#id = `uikit-color-picker-${this.#uid}`;
		this.#textId = `${this.#id}-text`;
		this.#colorId = `${this.#id}-color`;
		this.#errorId = `${this.#id}-error`;
		this.#getValue = getValue;
		this.#setValue = setValue;
	}
	
	get value() {
		return this.#getValue();
	}

	set value(newValue: string) {
		this.#setValue(newValue);
	}

	get textId() {
		return this.#textId;
	}

	get colorId() {
		return this.#colorId;
	}

	get errorId() {
		return this.#errorId;
	}

	get normalizedHex() {
		const hex = this.value;
		
		if (/^#([0-9A-F]{3})$/i.test(hex)) {
			return hex.replace(/^#([0-9A-F])([0-9A-F])([0-9A-F])$/i, "#$1$1$2$2$3$3");
		}

		if (/^#[0-9A-F]{6}$/i.test(hex)) {
			return hex;
		}

		return "#000000";
	}

	isValidHex(value: string): boolean {
		return ColorPickerState.HEX_PATTERN.test(value);
	}
}

export function createColorPickerState(getValue: GetValue, setValue: SetValue) {
	return new ColorPickerState(getValue, setValue);
}