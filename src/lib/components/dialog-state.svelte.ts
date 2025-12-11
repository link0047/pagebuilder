import { getContext, setContext, tick } from "svelte";
import { scrollLock } from "$lib/utils/scroll-lock";

type GetValue = () => boolean;
type SetValue = (value: boolean) => void;
type ElementRef = HTMLElement | undefined | null;

const DIALOG_KEY = Symbol("DIALOG");

class DialogState {
  static #id = 0;
  static #FOCUSABLE_SELECTOR = ":is(input:not([type='hidden']):not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), summary:not([disabled]), a[href], [tabindex]:not([tabindex='-1']), iframe, object, embed, area[href], audio[controls], video[controls], [contenteditable]:not([contenteditable='false'])):not([inert])";
  #dialogId;
  #dialogDisclosureId;
  #dialogTitleId;
  #dialogContentId;
  #dialogElement = $state<ElementRef>(null);
  #disclosure = $state<ElementRef>(null);
  #getValue: GetValue;
	#setValue: SetValue;
  #controller = new AbortController();
  #disclosureController: AbortController | undefined;

  constructor(getValue: GetValue, setValue: SetValue) {
    this.#dialogId = `uikit-dialog-${DialogState.#id++}`;
    this.#dialogDisclosureId = `${this.#dialogId}-disclosure`;
    this.#dialogTitleId = `${this.#dialogId}-title`;
    this.#dialogContentId = `${this.#dialogId}-content`;
    this.#getValue = getValue;
		this.#setValue = setValue;
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

  set disclosure(element: ElementRef) {
    if (this.#disclosureController) {
      this.#disclosureController.abort();
      this.#disclosureController = undefined;
    }

    this.#disclosure = element;

    if (!element) return;

    if (!(element instanceof HTMLElement)) {
      console.warn("DialogState: disclosure must be an HTMLElement");
			return;
    }

    this.#disclosureController = new AbortController();
    const { signal } = this.#disclosureController;

    if (!element.id) {
      element.id = this.#dialogDisclosureId;
    }

    element.setAttribute("aria-haspopup", "true");
		element.setAttribute("aria-controls", this.#dialogId);
		element.setAttribute("aria-expanded", String(this.isOpen));

    element.addEventListener("click", (event) => {
      event.stopPropagation();
      this.toggle();
    }, { signal });
  }

  set dialogElement(element: ElementRef) {
    const { signal } = this.#controller;

    this.#dialogElement = element;

		document.addEventListener("click", this.#handleClickOutside, { signal, capture: true });
    document.addEventListener("keydown", this.#handleKeydown, { signal });
	}

  get isOpen() {
		return this.#getValue();
	}

	set isOpen(value: boolean) {
		this.#setValue(value);
		
		if (this.#disclosure) {
			this.#disclosure.setAttribute("aria-expanded", String(value));
		}

    if (value) {
      scrollLock.lock();
      tick().then(() => this.#focusFirstElement());
    } else {
      scrollLock.unlock();
      this.#disclosure?.focus();
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

  #collectFocusableElements(root: Node | ElementRef = this.#dialogElement): HTMLElement[] {
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

  #focusFirstElement() {
    requestAnimationFrame(() => {
      const focusableElements = this.#collectFocusableElements();
      if (focusableElements.length > 0) {
        focusableElements[0].focus();
      } else {
        this.#dialogElement?.focus();
      }
    });
  }

  #handleKeydown = (event: KeyboardEvent) => {
    if (!this.isOpen) return;

    const { key, shiftKey } = event;

		if (key === "Escape" || key === "Esc") {
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

  #handleClickOutside = ({ target }: MouseEvent) => {
    if (
      this.isOpen &&
      !this.#dialogElement?.contains(target as Node) &&
      !this.#disclosure?.contains(target as Node)
    ) {
      this.close();
    }
  }

  toggle = () => {
		this.isOpen = !this.isOpen;
	}

	open = () =>{
		this.isOpen = true;
	}

	close = () => {
		this.isOpen = false;
	}

	destroy() {
    if (this.#disclosureController) this.#disclosureController.abort();
	  this.#controller.abort();
    scrollLock.destroy();
	}
}

export function setDialogState(getValue: GetValue, setValue: SetValue) {
  return setContext(DIALOG_KEY, new DialogState(getValue, setValue));
}

export function getDialogState(): DialogState {
  return getContext(DIALOG_KEY);
}