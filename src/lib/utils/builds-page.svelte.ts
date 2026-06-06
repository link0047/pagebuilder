import type { BuildListItem } from "$lib/api/builds.remote";
import { isRedirect, isHttpError } from "@sveltejs/kit";

export type Cursor = { created_at: string; id: string };

type Fetcher = (args: { cursor?: Cursor; limit: number }) => Promise<BuildListItem[]>;

const DEFAULT_PAGE_SIZE = 20;

// A keyset-paginated, accumulating list backed by a remote query.
// Each tab/list gets its own instance.
export class BuildsPage {
  items = $state<BuildListItem[]>([]);
  loading = $state(true);   // start true: SSR + pre-fetch render the skeleton
  loadingMore = $state(false);
  error = $state(false);
  done = $state(false);

  #fetcher: Fetcher;
  #pageSize: number;
  #started = false;          // guards against duplicate initial loads, independent of `loading`

  constructor(fetcher: Fetcher, pageSize = DEFAULT_PAGE_SIZE) {
    this.#fetcher = fetcher;
    this.#pageSize = pageSize;
  }

  #nextCursor(): Cursor | undefined {
    const last = this.items.at(-1);
    return last ? { created_at: last.created_at, id: last.id } : undefined;
  }

  async loadFirst() {
    if (this.#started) return;   // not keyed on `loading` anymore
    this.#started = true;
    this.loading = true;
    this.error = false;

    try {
      const rows = await this.#fetcher({ limit: this.#pageSize });
      this.items = rows;
      this.done = rows.length < this.#pageSize;
    } catch (err) {
      if (isRedirect(err) || isHttpError(err)) throw err;
      console.error("loadFirst failed:", err);
      this.error = true;
    } finally {
      this.loading = false;
    }
  }

  async loadMore() {
    if (this.done || this.loadingMore || this.loading) return;
    this.loadingMore = true;
    try {
      const rows = await this.#fetcher({ cursor: this.#nextCursor(), limit: this.#pageSize });
      this.items = [...this.items, ...rows];
      if (rows.length < this.#pageSize) this.done = true;
    } catch (err) {
      if (isRedirect(err) || isHttpError(err)) throw err;
      console.error("loadMore failed:", err);
      this.error = true;
    } finally {
      this.loadingMore = false;
    }
  }

  async reset() {
    this.#started = false;   // allow a fresh initial load
    this.items = [];
    this.done = false;
    this.error = false;
    await this.loadFirst();
  }

  remove(id: string) {
    this.items = this.items.filter((b) => b.id !== id);
  }
}
