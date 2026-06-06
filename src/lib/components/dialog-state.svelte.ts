import { getContext, setContext, tick } from "svelte";
import { scrollLock } from "$lib/utils/scroll-lock";

type Getter<T> = () => T;
type Setter<T> = (value: T) => void;
type MaybeElement = HTMLElement | undefined | null;

const DIALOG_KEY = Symbol("DIALOG");

export interface DialogOptions {
  closeOnEsc: boolean;
  closeOnOutsideClick: boolean;
}

class DialogState {
  static #id = 0;
  static #FOCUSABLE_SELECTOR = ":is(input:not([type='hidden']):not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), summary:not([disabled]), a[href], [tabindex]:not([tabindex='-1']), iframe, object, embed, area[href], audio[controls], video[controls], [contenteditable]:not([contenteditable='false'])):not([inert])";

  #dialogId;
  #dialogDisclosureId;
  #dialogTitleId;
  #dialogContentId;
  #dialogElement = $state<MaybeElement>(null);
  #disclosure = $state<MaybeElement>(null);
  #getValue: Getter<boolean>;
  #setValue: Setter<boolean>;
  #options: Getter<DialogOptions>;
  #trigger: Getter<boolean>;
  #controller = new AbortController();
  #disclosureController: AbortController | undefined;
  #getInitialFocus: Getter<MaybeElement>;

  constructor(
    getValue: Getter<boolean>,
    setValue: Setter<boolean>,
    getOptions: Getter<DialogOptions>,
    getTrigger: Getter<boolean>,
    getInitialFocus: Getter<MaybeElement>
  ) {
    this.#dialogId = `uikit-dialog-${DialogState.#id++}`;
    this.#dialogDisclosureId = `${this.#dialogId}-disclosure`;
    this.#dialogTitleId = `${this.#dialogId}-title`;
    this.#dialogContentId = `${this.#dialogId}-content`;
    this.#getValue = getValue;
    this.#setValue = setValue;
    this.#options = getOptions;
    this.#trigger = getTrigger;
    this.#getInitialFocus = getInitialFocus;

    $effect(() => {
      if (this.#getValue()) {
        scrollLock.lock();
        this.#applyInert(true);
        tick().then(() => {
          requestAnimationFrame(() => this.#focusInitialElement());
        });
      } else {
        scrollLock.unlock();
        this.#applyInert(false);
        this.#disclosure?.focus();
      }
    });
  }

  get id() {
    return this.#dialogId;
  }

  get disclosureId() {
    return this.#dialogDisclosureId;
  }

  get titleId() {
    return this.#dialogTitleId;
  }

  get contentId() {
    return this.#dialogContentId;
  }

  set disclosure(element: MaybeElement) {
    this.#disclosure = element;

    if (!element || !(element instanceof HTMLElement)) return;

    if (!element.id) element.id = this.#dialogDisclosureId;

    element.setAttribute("aria-haspopup", "dialog");
    element.setAttribute("aria-controls", this.#dialogId);
    element.setAttribute("aria-expanded", String(this.isOpen));

    if (!this.#trigger()) return;

    this.#disclosureController = new AbortController();
    const { signal } = this.#disclosureController;

    element.addEventListener("click", () => {
      this.toggle();
    }, { signal });
  }

  set dialogElement(element: MaybeElement) {
    const { signal } = this.#controller;

    this.#dialogElement = element;

    document.addEventListener("click", this.#onClickOutside, { signal, capture: true });
    document.addEventListener("keydown", this.#onKeydown, { signal });
  }

  get isOpen() {
    return this.#getValue();
  }

  set isOpen(value: boolean) {
    this.#setValue(value);

    if (this.#disclosure) {
      this.#disclosure.setAttribute("aria-expanded", String(value));
    }
  }

  // Set inert on all siblings of the dialog's portal root to prevent
  // background interaction for pointer users and assistive technology.
  #applyInert(open: boolean) {
    const portalRoot = this.#dialogElement?.closest("[data-portal]") ?? this.#dialogElement?.parentElement;
    if (!portalRoot) return;

    for (const sibling of Array.from(document.body.children)) {
      if (sibling !== portalRoot && sibling instanceof HTMLElement) {
        if (open) {
          sibling.inert = true;
        } else {
          sibling.inert = false;
        }
      }
    }
  }

  #isVisible(element: HTMLElement) {
    if (typeof element.checkVisibility === "function") {
      return element.checkVisibility({
        checkOpacity: true,
        checkVisibilityCSS: true
      });
    }

    return element.offsetParent !== null;
  }

  #isFocusable(element: HTMLElement) {
    if (
      element.inert ||
      element.matches(":disabled") ||
      !this.#isVisible(element) ||
      element.tabIndex < 0
    ) return false;

    if (element.tagName.includes("-") && typeof element.focus === "function") return true;

    return element.matches(DialogState.#FOCUSABLE_SELECTOR);
  }

  #getDeepActiveElement() {
    let activeElement = document.activeElement;

    while (activeElement?.shadowRoot?.activeElement) {
      activeElement = activeElement.shadowRoot.activeElement;
    }

    return activeElement;
  }

  #collectFocusableElements(root: Node | MaybeElement = this.#dialogElement): HTMLElement[] {
    if (!root) return [];

    const walker = document.createTreeWalker(root, NodeFilter.SHOW_ELEMENT, {
      acceptNode: (node) => {
        const element = node as HTMLElement;
        if (element.hidden || element.style.display === "none") return NodeFilter.FILTER_REJECT;

        return NodeFilter.FILTER_ACCEPT;
      }
    });

    const elements: HTMLElement[] = [];
    let currentNode: Node | null;
    while (currentNode = walker.nextNode()) {
      const element = currentNode as HTMLElement;
      if (element.shadowRoot) {
        const shadowElements = this.#collectFocusableElements(element.shadowRoot);
        elements.push(...shadowElements);
        continue;
      }

      if (this.#isFocusable(element)) {
        elements.push(element);
      }
    }

    return elements;
  }

  #focusInitialElement() {
    const requested = this.#getInitialFocus();
    if (requested && this.#isFocusable(requested as HTMLElement)) {
      requested.focus();
      return;
    }

    const focusableElements = this.#collectFocusableElements();
    if (focusableElements.length > 0) {
      focusableElements[0].focus();
    } else {
      this.#dialogElement?.focus();
    }
  }

  #onKeydown = (event: KeyboardEvent) => {
    if (!this.isOpen) return;

    const { key, shiftKey } = event;

    if (key === "Escape" || key === "Esc") {
      // Guard against the prop being false.
      if (!this.#options().closeOnEsc) return;
      event.stopPropagation();
      this.close();
      this.#disclosure?.focus();
      return;
    }

    if (key === "Tab") {
      const focusableElements = this.#collectFocusableElements();

      if (focusableElements.length === 0) {
        event.preventDefault();
        return;
      }

      const current = this.#getDeepActiveElement() as HTMLElement;
      const first = focusableElements[0];
      const last = focusableElements[focusableElements.length - 1];
      const isLostFocus = !focusableElements.includes(current) && !this.#dialogElement?.contains(current);

      const elementToFocus =
        shiftKey && (current === first || isLostFocus) ? last :
        !shiftKey && (current === last || isLostFocus) ? first :
        undefined;

      if (elementToFocus) {
        event.preventDefault();
        elementToFocus.focus();
      }
    }
  }

  #onClickOutside = ({ target }: MouseEvent) => {
    if (
      this.isOpen &&
      this.#options().closeOnOutsideClick && // Guard against the prop being false.
      !this.#dialogElement?.contains(target as Node) &&
      !this.#disclosure?.contains(target as Node)
    ) {
      this.close();
    }
  }

  toggle = () => {
    this.isOpen = !this.isOpen;
  }

  open = () => {
    this.isOpen = true;
  }

  close = () => {
    this.isOpen = false;
  }

  destroy() {
    if (this.#disclosureController) this.#disclosureController.abort();
    this.#controller.abort();
    // unlock(), not destroy() — destroying a shared singleton here would
    // break any other open dialogs on the page.
    scrollLock.unlock();
    // Ensure inert is cleaned up if the component is destroyed while open.
    this.#applyInert(false);
  }
}

export function setDialogState(
  getValue: Getter<boolean>,
  setValue: Setter<boolean>,
  getOptions: Getter<DialogOptions>,
  getTrigger: Getter<boolean>,
  getInitialFocus: Getter<MaybeElement>
) {
  return setContext(DIALOG_KEY, new DialogState(getValue, setValue, getOptions, getTrigger, getInitialFocus));
}

export function getDialogState(): DialogState {
  return getContext(DIALOG_KEY);
}
