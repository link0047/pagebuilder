import { getContext, setContext } from "svelte";
import { scrollLock } from "$lib/utils/scroll-lock";

type GetValue = () => boolean;
type SetValue = (value: boolean) => void;

const MENU_KEY = Symbol("MENU");

class MenuState {
	static #id = 0;
	
	#menuId;
	#menuDisclosureId;
	#menuElement = $state<HTMLElement | undefined | null>(null);
	#anchor = $state<HTMLElement | undefined | null>(null);
	#getValue: GetValue;
	#setValue: SetValue;
	#controller = new AbortController();
	
	constructor(getValue: GetValue, setValue: SetValue) {
		this.#menuId = `uikit-menu-${MenuState.#id++}`;
		this.#menuDisclosureId = `${this.#menuId}-disclosure`;
		this.#getValue = getValue;
		this.#setValue = setValue;
	}

	get id() {
		return this.#menuId;
	}

	get disclosureId() {
		return this.#menuDisclosureId;
	}

	set anchor(element: HTMLElement | undefined | null) {
		if (this.#anchor) {
			this.#anchor.removeEventListener("click", this.toggle);
		}
		
		if (!(element instanceof HTMLElement)) {
			console.warn("MenuState: anchor must be an HTMLElement");
			return;
		}

		const { signal } = this.#controller;

		if (!element.id) {
			element.id = this.#menuDisclosureId;
		}

		element.setAttribute("aria-haspopup", "true");
		element.setAttribute("aria-expanded", String(this.isOpen));
		element.setAttribute("aria-controls", this.#menuId);
		element.addEventListener("click", this.toggle, { signal });
		document.addEventListener("keydown", this.#handleKeydown, { signal });
		document.addEventListener("click", this.#handleClickOutside, { signal });
		this.#anchor = element;
	}

	get anchor() {
		return this.#anchor;
	}

	set menu(element: HTMLElement | undefined | null) {
		this.#menuElement = element;
	}
	
	get menu() {
		return this.#menuElement;
	}

	get isOpen() {
		return this.#getValue();
	}

	set isOpen(value: boolean) {
		this.#setValue(value);
		
		if (this.#anchor) {
			this.#anchor.setAttribute("aria-expanded", String(value));
		}

    if (value) {
      scrollLock.lock();
    } else {
      scrollLock.unlock();
    }
	}

	#handleKeydown = ({ key }: KeyboardEvent) => {
		if (key === "Escape" && this.isOpen) {
			this.close();
			this.#anchor?.focus();
		}
	}

	#handleClickOutside = ({ target }: MouseEvent) => {
	if (
		this.isOpen &&
		!this.#menuElement?.contains(target as Node) &&
		!this.#anchor?.contains(target as Node)
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
		if (this.#anchor) {
			this.#controller.abort();
		}

    scrollLock.destroy();
	}
}

export function setMenuState(getValue: GetValue, setValue: SetValue) {
	return setContext(MENU_KEY, new MenuState(getValue, setValue));
}

export function getMenuState(): MenuState {
	return getContext(MENU_KEY);
}