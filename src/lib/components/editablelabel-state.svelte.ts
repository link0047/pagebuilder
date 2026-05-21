import { tick } from "svelte";

type EditableLabelStateOptions = {
  getValue: () => string | undefined | null;
  setValue: (value: string) => void;
  getEditMode: () => boolean;
  setEditMode: (editMode: boolean) => void;
  oncommit?: (value: string) => void;
}

export class EditableLabelState {
  readonly inputId = crypto.randomUUID();
  readonly descriptionId = crypto.randomUUID();
  readonly liveRegionId = crypto.randomUUID();

  // Refs — set by the component via .inputRef = el and .buttonRef = el
  inputRef: HTMLInputElement | undefined = $state();
  buttonRef: HTMLButtonElement | undefined = $state();

  // Internal state
  isEditing: boolean = $state(false);
  announcement: string = $state("");

  #snapshot = "";
  #cancelling = false;
  #opts: EditableLabelStateOptions;

  constructor(opts: EditableLabelStateOptions) {
    this.#opts = opts;

    $effect(() => {
      if (opts.getEditMode()) {
        this.startEditing();
      }
    });
  }

  get descriptionText(): string {
    return this.isEditing ? "Press Enter to confirm, Escape to cancel" : "Press to edit";
  }

  handleBlur = () => {
    if (!this.#cancelling) {
      this.commitEdit();
    }
    this.#cancelling = false;
  };

  handleKeydown = (event: KeyboardEvent) => {
    if (event.key === "Enter") {
      event.preventDefault();
      this.commitEdit();
    }
    if (event.key === "Escape") {
      event.preventDefault();
      this.cancelEdit();
    }
  };

  handlePointerdown = (event: PointerEvent) => {
    if (event.pointerType !== "") {
      event.preventDefault();
      this.startEditing();
    }
  };

  handleClick = (event: MouseEvent) => {
    if (!this.isEditing && (event.detail === 0 || (event as PointerEvent).pointerType === "")) {
      this.startEditing();
    }
  };

  async startEditing() {
    this.#snapshot = this.#opts.getValue() ?? "";
    this.#cancelling = false;
    this.isEditing = true;
    await tick();
    this.inputRef?.focus();
    this.inputRef?.select();
  }

  cancelEdit = () => {
    this.#cancelling = true;
    this.#opts.setValue(this.#snapshot);
    this.isEditing = false;
    this.#opts.setEditMode(false);
    this.announcement = "Edit cancelled";
    this.buttonRef?.focus();
  };

  commitEdit = () => {
    if (this.#cancelling) return;
    const current = this.#opts.getValue();
    if (typeof current === "string" && !current.trim()) {
      this.#opts.setValue(this.#snapshot);
    }
    this.isEditing = false;
    this.#opts.setEditMode(false);
    const committed = this.#opts.getValue() ?? "";
    this.#opts.oncommit?.(committed);
    this.announcement = `Label updated to ${committed}`;
    this.buttonRef?.focus();
  };
}
