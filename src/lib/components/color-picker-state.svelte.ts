type GetValue = () => string;
type SetValue = (newValue: string) => void;

// Matches any valid CSS color keyword, rgb/rgba, hsl/hsla, or hex
const CSS_COLOR_PATTERN = /^(#([0-9A-F]{3}|[0-9A-F]{6})|rgb\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*\)|rgba\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*,\s*[\d.]+\s*\)|hsl\(\s*\d+\s*,\s*[\d.]+%\s*,\s*[\d.]+%\s*\)|hsla\(\s*\d+\s*,\s*[\d.]+%\s*,\s*[\d.]+%\s*,\s*[\d.]+\s*\)|transparent|inherit|currentcolor|[a-z]+)$/i;

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
    this.#id = `wcag-ui-color-picker-${this.#uid}`;
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
    // Empty input clears the value
    if (newValue.trim() === "") {
      this.#setValue("");
      return;
    }
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

  // Used to drive the <input type="color"> swatch
  // Returns a hex value when possible, falls back to #000000 for
  // non-hex values so the swatch doesn't break
  get normalizedHex() {
    const val = this.value;

    if (!val) return "#000000";

    if (/^#([0-9A-F]{3})$/i.test(val)) {
      return val.replace(/^#([0-9A-F])([0-9A-F])([0-9A-F])$/i, "#$1$1$2$2$3$3");
    }

    if (/^#[0-9A-F]{6}$/i.test(val)) {
      return val;
    }

    // For non-hex values, let the browser resolve it via a canvas
    return resolveColorToHex(val) ?? "#000000";
  }

  isValidColor(value: string): boolean {
    if (value.trim() === "") return true;
    return CSS_COLOR_PATTERN.test(value.trim());
  }

  // Keep old name as alias so ColorPicker.svelte doesn't break
  isValidHex(value: string): boolean {
    return this.isValidColor(value);
  }
}

// Resolves any CSS color string to hex using a canvas element
// Returns null if the color is invalid or can't be resolved
function resolveColorToHex(color: string): string | null {
  try {
    const canvas = document.createElement("canvas");
    canvas.width = canvas.height = 1;
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;

    ctx.fillStyle = color;
    ctx.fillRect(0, 0, 1, 1);

    const [r, g, b] = ctx.getImageData(0, 0, 1, 1).data;
    return "#" + [r, g, b].map(v => v.toString(16).padStart(2, "0")).join("");
  } catch {
    return null;
  }
}

export function createColorPickerState(getValue: GetValue, setValue: SetValue) {
  return new ColorPickerState(getValue, setValue);
}
