/**
 * Detects whether a given Web Storage area is usable.
 *
 * A bare existence check is insufficient — the object can exist but still throw
 * on write (Safari private mode, disabled storage, exhausted quota), and on some
 * browsers accessing the area itself throws. The store is passed as a thunk so
 * that an access-time throw is also caught, and a real write/read/remove
 * round-trip confirms the area actually works.
 *
 * @param getStore Lazily returns the storage area.
 * @returns `true` if the area can be written to and read from.
 */
function isStorageSupported(getStore: () => Storage): boolean {
  try {
    const store = getStore()
    const key = "_ranger-test-key"
    store.setItem(key, "hi")
    store.getItem(key)
    store.removeItem(key)
    return true
  } catch (e) {
    return false
  }
}

/**
 * In-memory fallback that mirrors the Web Storage API.
 *
 * Implements `Storage` so it is a drop-in substitute for `localStorage` or
 * `sessionStorage` when the native area is unavailable. Behavior matches the
 * native API: missing keys return `null`, values are coerced to strings, and
 * `removeItem` deletes the key rather than nulling it.
 *
 * Note: data lives only for the page session and is not shared across tabs.
 */
class Memory implements Storage {
  private cache: Record<string, string> = {}

  /**
   * Stores a value, coercing it to a string to match native behavior.
   * @param cacheKey Key to store under.
   * @param data Value to store (stringified).
   */
  setItem(cacheKey: string, data: string): void {
    this.cache[cacheKey] = String(data)
  }

  /**
   * Retrieves a value.
   * @param cacheKey Key to look up.
   * @returns The stored string, or `null` if the key is absent.
   */
  getItem(cacheKey: string): string | null {
    return Object.prototype.hasOwnProperty.call(this.cache, cacheKey)
      ? this.cache[cacheKey]
      : null
  }

  /**
   * Deletes a key.
   * @param cacheKey Key to remove.
   */
  removeItem(cacheKey: string): void {
    delete this.cache[cacheKey]
  }

  /** Removes all keys. */
  clear(): void {
    this.cache = {}
  }

  /**
   * Returns the key at a given index in insertion order.
   * @param index Zero-based position.
   * @returns The key name, or `null` if out of range.
   */
  key(index: number): string | null {
    return Object.keys(this.cache)[index] ?? null
  }

  /** Number of stored keys. */
  get length(): number {
    return Object.keys(this.cache).length
  }
}

/** A storage wrapper that fails soft on writes. */
export type SafeStorage = {
  /**
   * Whether the wrapper is running on the in-memory fallback (`true`) rather
   * than the native Web Storage area (`false`). Use this to warn users that data
   * will not persist, gate features, etc.
   */
  readonly usingFallback: boolean

  /**
   * Writes a value, failing soft on runtime errors.
   * @returns `true` if the write succeeded, `false` if it threw (e.g. quota).
   */
  setItem(cacheKey: string, data: string): boolean

  /** Reads a value, or `null` if absent. */
  getItem(cacheKey: string): string | null

  /** Deletes a key. */
  removeItem(cacheKey: string): void

  /** Removes all keys from the active backend. */
  clear(): void
}

/**
 * Builds a storage wrapper around a native Web Storage area, falling back to an
 * in-memory store when the area is unavailable.
 *
 * Reads and deletes trust the support check performed at construction, so they
 * are not guarded. Writes are guarded because `setItem` can still throw at
 * runtime (e.g. quota exceeded) even after the check passes; a failed write
 * returns `false` rather than throwing.
 *
 * @param getStore Lazily returns the native area, e.g. `() => window.localStorage`.
 * @returns A `SafeStorage` wrapper.
 */
function createStorage(getStore: () => Storage): SafeStorage {
  const usingFallback = !isStorageSupported(getStore)
  const backend: Storage = usingFallback ? new Memory() : getStore()

  return {
    usingFallback,
    setItem(cacheKey, data) {
      try {
        backend.setItem(cacheKey, data)
        return true
      } catch (e) {
        return false
      }
    },
    getItem(cacheKey) {
      return backend.getItem(cacheKey)
    },
    removeItem(cacheKey) {
      backend.removeItem(cacheKey)
    },
    clear() {
      backend.clear()
    },
  }
}

/** Persistent storage (survives tab close), with in-memory fallback. */
export const storage = createStorage(() => window.localStorage)

/** Session storage (cleared on tab close), with in-memory fallback. */
export const session = createStorage(() => window.sessionStorage)
