import { getContext, setContext } from "svelte";

const SEGMENTEDCONTROL_KEY = Symbol("SEGMENTEDCONTROL");

// Stable counter shared across all instances for unique heading IDs.
let headingCounter = 0;

class SegmentedControlState {
  // Map from stable registration ID → value. Avoids index-shifting on removal.
  #buttons = $state(new Map<number, string>());
  #selectedId = $state<number | null>(null);
  #nextId = 0;
  #initialValue: string | undefined;
  #headingId: string;

  constructor(initialValue: unknown) {
    this.#initialValue = initialValue?.toString();
    // Generate eagerly in the constructor — no side-effectful getter needed.
    this.#headingId = `uikit-segmented-control-heading-${headingCounter++}`;
  }

  get headingId(): string {
    return this.#headingId;
  }

  get selectedValue(): string | undefined {
    if (this.#selectedId === null) return undefined;
    return this.#buttons.get(this.#selectedId);
  }

  // Returns the stable ID the button should hold onto.
  registerButton(value: string): number {
    const id = this.#nextId++;
    this.#buttons.set(id, value);

    if (this.#initialValue !== undefined && value === this.#initialValue) {
      this.#selectedId = id;
    }

    // Select the first registered button by default.
    if (this.#selectedId === null) {
      this.#selectedId = id;
    }

    return id;
  }

  unregisterButton(id: number) {
    const wasSelected = this.#selectedId === id;
    this.#buttons.delete(id);

    if (wasSelected) {
      // Pick the first remaining button, if any.
      const first = this.#buttons.keys().next();
      this.#selectedId = first.done ? null : first.value;
    }
  }

  isSelected(id: number): boolean {
    return this.#selectedId === id;
  }

  selectById(id: number) {
    if (this.#buttons.has(id)) {
      this.#selectedId = id;
    }
  }

  selectByValue(value: string) {
    for (const [id, v] of this.#buttons) {
      if (v === value) {
        this.#selectedId = id;
        return;
      }
    }
  }

  selectNext() {
    const ids = [...this.#buttons.keys()];
    if (ids.length === 0) return;
    const current = ids.indexOf(this.#selectedId!);
    this.#selectedId = ids[(current + 1) % ids.length];
  }

  selectPrevious() {
    const ids = [...this.#buttons.keys()];
    if (ids.length === 0) return;
    const current = ids.indexOf(this.#selectedId!);
    this.#selectedId = ids[(current - 1 + ids.length) % ids.length];
  }
}

export function setSegmentedControlState(initialValue: unknown) {
  return setContext(SEGMENTEDCONTROL_KEY, new SegmentedControlState(initialValue));
}

export function getSegmentedControlState() {
  return getContext<SegmentedControlState>(SEGMENTEDCONTROL_KEY);
}
