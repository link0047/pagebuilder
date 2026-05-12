import { getContext, setContext } from "svelte";
import { scrollLock } from "$lib/utils/scroll-lock";

type GetValue = () => boolean;
type SetValue = (value: boolean) => void;
type ExternalClickSource = (close: () => void) => () => void;

const MENU_KEY = Symbol("MENU");
const externalClickSources = new Set<ExternalClickSource>();
const activeMenus = new Set<MenuState>();

export function registerMenuClickSource(source: ExternalClickSource): () => void {
  externalClickSources.add(source);
  // Apply to all currently active menus
  const cleanups = new Map<MenuState, () => void>();
  for (const menu of activeMenus) {
    cleanups.set(menu, source(menu.close));
  }
  return () => {
    externalClickSources.delete(source);
    for (const [, cleanup] of cleanups) cleanup();
  };
}

class MenuState {
	static #id = 0;

	#menuId;
	#menuDisclosureId;
	#menuElement = $state<HTMLElement | undefined | null>(null);
	#anchor = $state<HTMLElement | undefined | null>(null);
	#getValue: GetValue;
	#setValue: SetValue;
  #controller = new AbortController();
	#externalCleanups: Array<() => void> = [];

	constructor(getValue: GetValue, setValue: SetValue) {
		this.#menuId = `uikit-menu-${MenuState.#id++}`;
		this.#menuDisclosureId = `${this.#menuId}-disclosure`;
		this.#getValue = getValue;
    this.#setValue = setValue;

    activeMenus.add(this);

    // Apply any already-registered external click sources
    for (const source of externalClickSources) {
      const cleanup = source(this.close);
      this.#externalCleanups.push(cleanup);
    }
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

	#handleClickOutside = (event: MouseEvent) => {
		if (!this.isOpen) return;

		const path = event.composedPath();
		const clickedMenu = this.#menuElement && path.includes(this.#menuElement);
		const clickedAnchor = this.#anchor && path.includes(this.#anchor);

		if (!clickedMenu && !clickedAnchor) {
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
    activeMenus.delete(this);
    for (const cleanup of this.#externalCleanups) cleanup();

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
