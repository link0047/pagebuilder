<script lang="ts">
  import type { Snippet } from "svelte";
  import { BREAKPOINTS } from "$lib/constants/breakpoints";
  import Image from "./Image.svelte";
  import Link from "./Link.svelte";

  export type Alignment = "left" | "center" | "right";

  export type TitleSize = "sm" | "md" | "lg" | "xl" | "2xl" | string;
  export type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6;
  export type ImagePlacement = "above" | "below";

  // Mirrors Link.svelte's contract: `external` drives both target="_blank"
  // and rel="noopener noreferrer" there, so it stays one flag here too.
  export type LinkValue = { href?: string; external?: boolean };


  export type Spacing = {
    top?: string;
    right?: string;
    bottom?: string;
    left?: string;
  };

  /**
   * One line of heading text. The first entry renders at `headingLevel`; the
   * rest render as spans — they're supporting display copy, not document
   * structure, so they carry no heading semantics. That also makes an
   * <h2> -> <h5> -> <h3> outline unrepresentable.
   */
  export type Heading = {
    text: string;
    size?: TitleSize;
    weight?: string;
    color?: string;
    link?: LinkValue;
  };

  /** Scene7 transform params appended to a source URL as a query string. */
  export type HeroParams = { wid?: string | number; qlt?: string | number };

  /**
   * One breakpoint's image. `url2x` is optional and only for high-density
   * displays; when absent the 1x URL is used at every density.
   */
  export type HeroSource = {
    url?: string;
    url2x?: string;
    params?: HeroParams;
  };

  /**
   * Scene7 hero. Mobile is the base; tablet falls back to mobile, and desktop
   * falls back to tablet (and so to mobile). No `enabled` flag — an absent
   * mobile url means no hero.
   */
  export type HeroImage = {
    mobile?: HeroSource;
    tablet?: HeroSource;
    desktop?: HeroSource;
    alt?: string;
  };

  export type LayoutSpacing = { padding?: Spacing; margin?: Spacing };

  export const TITLE_SIZES: Record<string, string> = {
    sm: "1.25rem",
    md: "1.5rem",
    lg: "1.75rem",
    xl: "2rem",
    "2xl": "2.5rem",
  };

  type Props = {
    children?: Snippet;
    header?: Snippet;
    footer?: Snippet;
    /** Repeatable headings. First renders at `headingLevel`, rest as spans. */
    headings?: Heading[];
    /** Gap between headings, e.g. "12px". */
    headingGap?: number | string;

    // These stay block-level. Per-heading levels would allow a broken document
    // outline; alignment applies to the heading group, not to single lines.
    titleAlignment?: Alignment;
    headingLevel?: HeadingLevel;

    // --- shim: delete once every build and template is migrated ---
    /** @deprecated Use `headings`. */
    title?: string;
    /** @deprecated Use `headings[0].size`. */
    titleSize?: string;
    /** @deprecated Use `headings[0].color`. */
    titleColor?: string;
    /** @deprecated Use `headings[0].weight`. */
    titleWeight?: string;
    /** @deprecated Use `headings[0].link`. */
    titleLink?: LinkValue;
    // --- end shim ---
    backgroundColor?: string;
    layout?: LayoutSpacing;
    hero?: HeroImage;
    imagePlacement?: ImagePlacement;
    [key: string]: unknown;
  };

  let {
    children,
    header,
    footer,
    headings,
    headingGap,
    titleAlignment = "center",
    headingLevel = 2,
    title,
    titleSize,
    titleColor,
    titleWeight,
    titleLink,
    backgroundColor,
    layout,
    hero,
    imagePlacement = "above",
    ...restProps
  }: Props = $props();

  const headingId = crypto.randomUUID();
  const HeadingTag = $derived(`h${headingLevel}`);

  // --- shim: delete once every build and template is migrated ---
   // Reads `headings` when present, falls back to the old title* props. Both
   // shapes render identically, so there's no window during the migration.
   const resolvedHeadings = $derived.by<Heading[]>(() => {
     // Checked with `!== undefined`, not truthiness: an empty array means the
     // author deleted every heading, which is a real choice. `headings?.length`
     // would treat [] as "unmigrated" and fall through to the title shim,
     // resurrecting a heading the author just removed.
     if (headings !== undefined) return headings.filter((h) => h?.text);
     if (!title) return [];
     return [{
       text: title,
       size: titleSize,
       weight: titleWeight,
       color: titleColor,
       link: titleLink,
     }];
   });
   // --- end shim ---

  /** Resolves both legacy tokens ("md") and raw CSS values ("24px"). */
  function sizeToken(size?: TitleSize): string | undefined {
    if (!size) return undefined;
    return TITLE_SIZES[size as string] ?? (size as string);
  }

  function toDim(v?: string): string | undefined {
    if (v == null || v === "") return undefined;
    // Bare numbers are treated as px; anything with a unit passes through.
    return /^-?\d+(\.\d+)?$/.test(v) ? `${v}px` : v;
  }

  const paddingStyle = $derived(spacingToCss(layout?.padding));
  const marginStyle = $derived(spacingToCss(layout?.margin));

  function spacingToCss(s?: Spacing): string | undefined {
    if (!s) return undefined;
    const t = toDim(s.top) ?? "0";
    const r = toDim(s.right) ?? "0";
    const b = toDim(s.bottom) ?? "0";
    const l = toDim(s.left) ?? "0";
    if (!s.top && !s.right && !s.bottom && !s.left) return undefined;
    return `${t} ${r} ${b} ${l}`;
  }

  /** Compose a Scene7 URL with its transform params appended. */
  function composeSrc(raw?: string, params?: HeroParams): string | null {
    if (!raw?.trim()) return null;
    try {
      const url = new URL(raw);
      if (params?.wid) url.searchParams.set("wid", String(params.wid));
      if (params?.qlt) url.searchParams.set("qlt", String(params.qlt));
      return url.toString();
    } catch {
      // Not absolute (a relative path, or mid-typing in the editor) — pass it
      // through rather than dropping the image entirely.
      return raw;
    }
  }

  /** `src` plus an optional 2x descriptor for high-density displays. */
  function srcset(source: HeroSource): string | undefined {
    const src1x = composeSrc(source.url, source.params);
    if (!src1x) return undefined;
    const src2x = composeSrc(source.url2x, source.params);
    return src2x ? `${src1x} 1x, ${src2x} 2x` : src1x;
  }

  /**
   * Resolve the fallback chain: tablet inherits mobile, desktop inherits
   * tablet. One url covers every breakpoint; adding tablet splits it from
   * desktop; adding desktop gives all three their own.
   */
  const resolvedHero = $derived.by(() => {
    const mobile = hero?.mobile;
    if (!mobile?.url?.trim()) return null;
    const tablet = hero?.tablet?.url?.trim() ? hero.tablet : mobile;
    const desktop = hero?.desktop?.url?.trim() ? hero.desktop : tablet;
    return { mobile, tablet, desktop };
  });

  const gapCss = $derived(
    headingGap != null && headingGap !== "" ? toDim(String(headingGap)) : undefined
  );

  const hasHeading = $derived(!!header || resolvedHeadings.length > 0);
  const hasImage = $derived(!!resolvedHero);
  const hasHeader = $derived(hasHeading || hasImage);
</script>

{#snippet linkWrap(link: LinkValue | undefined, content: Snippet)}
  {#if link?.href?.trim()}
    <!-- Link handles target/rel/focus-ring. `color: inherit` + `underline:
         none` keep the heading looking like a heading rather than a link.
         Wrapped in a span because passing `class` to Link would land in its
         restProps and clobber its own `wcag-ui-link` class. -->
    <span class="spn-ui-block__link">
      <Link
        href={link.href}
        external={link.external ?? false}
        color="inherit"
        underline="none"
      >
        {@render content()}
      </Link>
    </span>
  {:else}
    {@render content()}
  {/if}
{/snippet}

{#snippet headerImage()}
  {#if resolvedHero}
    <picture class="spn-ui-block__image">
      <source
        media="(min-width: {BREAKPOINTS.desktop}px)"
        srcset={srcset(resolvedHero.desktop)}
      />
      <source
        media="(min-width: {BREAKPOINTS.tablet}px)"
        srcset={srcset(resolvedHero.tablet)}
      />
      <Image
        src={composeSrc(resolvedHero.mobile.url, resolvedHero.mobile.params)}
        srcset={srcset(resolvedHero.mobile)}
        alt={hero?.alt ?? ""}
        width={1400}
        height={260}
      />
    </picture>
  {/if}
{/snippet}

{#snippet headerHeading()}
  {#if header}
    <div id={headingId} class="spn-ui-block__header-content">
      {@render header()}
    </div>
  {:else if resolvedHeadings.length}
    <div class="spn-ui-block__headings">
      {#each resolvedHeadings as heading, i}
        {#snippet headingText()}
          {heading.text}
        {/snippet}

        {#if i === 0}
          <!-- Only the first heading is real document structure, and it carries
               headingId so aria-labelledby names the section by its heading. -->
          <svelte:element
            this={HeadingTag}
            id={headingId}
            class="spn-ui-block__title"
            style:--spn-ui-block-title-size={sizeToken(heading.size)}
            style:--spn-ui-block-title-weight={heading.weight}
            style:--spn-ui-block-title-color={heading.color}
          >
            {@render linkWrap(heading.link, headingText)}
          </svelte:element>
        {:else}
          <!-- Spans, not paragraphs: supporting display copy carries no
               semantics, which beats fake <h3>s polluting the outline. They
               block-ify as flex items of .spn-ui-block__headings. -->
          <span
            class="spn-ui-block__subtitle"
            style:--spn-ui-block-subtitle-size={sizeToken(heading.size)}
            style:--spn-ui-block-subtitle-weight={heading.weight}
            style:--spn-ui-block-subtitle-color={heading.color}
          >
            {@render linkWrap(heading.link, headingText)}
          </span>
        {/if}
      {/each}
    </div>
  {/if}
{/snippet}

<section
  class="spn-ui-block"
  aria-labelledby={hasHeading ? headingId : undefined}
  style:--spn-ui-block-bg={backgroundColor}
  style:--spn-ui-block-title-align={titleAlignment}
  style:--spn-ui-block-heading-gap={gapCss}
  style:--spn-ui-block-padding={paddingStyle}
  style:--spn-ui-block-margin={marginStyle}
  {...restProps}
>
  {#if hasHeader}
    <header class="spn-ui-block__header">
      {#if imagePlacement === "above"}
        {@render headerImage()}
        {@render headerHeading()}
      {:else}
        {@render headerHeading()}
        {@render headerImage()}
      {/if}
    </header>
  {/if}

  <div class="spn-ui-block__content">
    {@render children?.()}
  </div>

  {#if footer}
    <footer class="spn-ui-block__footer">
      {@render footer()}
    </footer>
  {/if}
</section>

<style>
  @layer variables, base;

  @layer variables {
    .spn-ui-block {
      --spn-ui-block-bg: transparent;
      --spn-ui-block-title-align: center;
      --spn-ui-block-border-radius: 1rem;
      --spn-ui-block-padding-block-end: 1rem;
      --spn-ui-block-header-padding-inline: 1rem;
      --spn-ui-block-header-padding-block: 1rem;
      --spn-ui-block-title-size: 1.5rem;
      --spn-ui-block-title-weight: 600;
      --spn-ui-block-title-color: #212121;
      --spn-ui-block-title-line-height: 1.2;
      --spn-ui-block-heading-gap: 0.25rem;
      --spn-ui-block-subtitle-size: 1rem;
      --spn-ui-block-subtitle-weight: 500;
      --spn-ui-block-subtitle-color: inherit;
    }
  }

  @layer base {
    .spn-ui-block {
      display: flex;
      flex-direction: column;
      border-radius: var(--spn-ui-block-border-radius);
      background-color: var(--spn-ui-block-bg);
      /* Author-set padding/margin override the defaults when present. */
      padding: var(--spn-ui-block-padding, 0 0 var(--spn-ui-block-padding-block-end));
      margin: var(--spn-ui-block-margin, 0);
      font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
    }

    .spn-ui-block:not(:has(.spn-ui-block__header)):not([style*="--spn-ui-block-padding"]) {
      padding-block-start: var(--spn-ui-block-padding-block-end);
    }

    .spn-ui-block__header {
      display: flex;
      flex-direction: column;
      align-items: center;
    }

    .spn-ui-block__image {
      display: block;
      width: 100%;
      overflow: hidden;
    }

    .spn-ui-block__headings {
      display: flex;
      flex-direction: column;
      gap: var(--spn-ui-block-heading-gap);
      width: 100%;
      padding-inline: var(--spn-ui-block-header-padding-inline);
      padding-block: var(--spn-ui-block-header-padding-block);
    }

    .spn-ui-block__title {
      margin: 0;
      width: 100%;
      line-height: var(--spn-ui-block-title-line-height);
      font-weight: var(--spn-ui-block-title-weight);
      font-size: var(--spn-ui-block-title-size);
      color: var(--spn-ui-block-title-color);
      text-align: var(--spn-ui-block-title-align);
      overflow-wrap: break-word;
      word-break: break-word;
    }

    .spn-ui-block__subtitle {
      margin: 0;
      width: 100%;
      line-height: 1.3;
      font-size: var(--spn-ui-block-subtitle-size);
      font-weight: var(--spn-ui-block-subtitle-weight);
      color: var(--spn-ui-block-subtitle-color);
      text-align: var(--spn-ui-block-title-align);
      overflow-wrap: break-word;
      word-break: break-word;
    }

    .spn-ui-block__link {
      display: block;
      color: inherit;
    }

    /* Underline the heading text on hover rather than letting Link decorate
       itself. The whole descendant part is one :global(...) at the end of the
       sequence — Svelte rejects :global() in the middle, and the hover target
       is Link's own <a>, which this component's scoping can't reach. */
    .spn-ui-block__link:hover :global(.spn-ui-block__title),
    .spn-ui-block__link:hover :global(.spn-ui-block__subtitle) {
      text-decoration: underline;
    }

    .spn-ui-block__header-content { display: block; }

    .spn-ui-block__content { flex: 1; }

    .spn-ui-block__footer {
      margin-block-start: 1rem;
      padding-inline: var(--spn-ui-block-header-padding-inline);
    }
  }
</style>
