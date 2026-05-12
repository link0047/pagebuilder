<script lang="ts">
  import Image from "./Image.svelte";
  import Badge from "./Badge.svelte";
  import { BREAKPOINTS } from "$lib/constants/breakpoints";
  import type { Variant, Color, Size, Shape } from "./Badge.svelte";

  type BadgePosition = "top-left" | "top-right" | "bottom-left" | "bottom-right";

  type CustomColor = {
    color?: string;
    bgColor?: string;
    borderColor?: string;
  }

  type BadgeConfig = {
    text: string;
    position?: BadgePosition;
    gap?: string;
    size?: Size;
    color?: Color;
    shape?: Shape;
    variant?: Variant;
    customColor?: CustomColor;
  }

  export type Props = {
    href?: string;
    src?: { desktop?: string; tablet?: string; mobile?: string };
    name: string;
    price: { original: number; sale?: number | null };
    badge?: BadgeConfig;
  }

  let {
    href = "",
    src = { desktop: "", tablet: "", mobile: "" },
    name,
    price = { original: 0, sale: null },
    badge,
  }: Props = $props();

  const resolvedSrc = $derived.by(() => {
    const mobile = src.mobile ?? "";
    const tablet = src.tablet ?? mobile;
    const desktop = src.desktop ?? tablet;
    return { desktop, tablet, mobile };
  });

  let tag = $derived(href ? "a" : "div");
  let currentPrice = $derived(Number(price.sale ?? price.original) || 0);
  let onSale = $derived(price.sale != null);
</script>

<div class="spn-ui-product-card">
  <svelte:element
    this={tag}
    class="spn-ui-product-card__content"
    class:spn-ui-product-card__link={tag === "a"}
    {...(tag === "a" ? { href } : {})}
  >
    <div class="spn-ui-product-card__media-container">
      <picture class="spn-ui-product-card__media">
        <source media="(min-width: {BREAKPOINTS.desktop}px)" srcset={resolvedSrc.desktop} />
        <source media="(min-width: {BREAKPOINTS.tablet}px)" srcset={resolvedSrc.tablet} />
        <Image width={300} height={300} src={resolvedSrc.mobile} alt="" />
      </picture>
      {#if badge}
        <div
          class="spn-ui-product-card__badge"
          data-position={badge.position ?? "top-left"}
          style:--badge-inset-gap={badge.gap ?? ".25rem"}
          style:--wcag-badge-color={badge.customColor?.color}
          style:--wcag-badge-bg-color={badge.customColor?.bgColor}
          style:--wcag-badge-border-color={badge.customColor?.borderColor}
        >
          <Badge
            color={badge.color}
            size={badge.size}
            shape={badge.shape}
            variant={badge.variant}
          >
            {badge.text}
          </Badge>
        </div>
      {/if}
    </div>
    <div class="spn-ui-product-card__description">
      <div class="spn-ui-product-card__price">
        <span class="spn-ui-product-card__price-current" aria-hidden="true">
          <span class="spn-ui-product-card__price-symbol">$</span>
          <span class="spn-ui-product-card__price-dollars">{Math.floor(currentPrice)}</span>
          <span class="spn-ui-product-card__price-cents">
            {currentPrice.toFixed(2).split(".")[1]}
          </span>
        </span>
        {#if onSale}
          <s class="spn-ui-product-card__price-original">
            ${price.original}
          </s>
        {/if}
        <span class="visually-hidden">
          {onSale ? `Sale price $${currentPrice}, was $${price.original}` : `$${currentPrice}`}
        </span>
      </div>
      <span class="spn-ui-product-card__name">{name}</span>
    </div>
  </svelte:element>
  <div class="spn-ui-product-card__action"></div>
</div>

<style>
  .visually-hidden {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border-width: 0;
  }

  .spn-ui-product-card {
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    height: 100%;
    gap: 1rem;
    background-color: #fff;
    padding-block: .5rem;
    padding-inline: .5rem;
    border-radius: .5rem;
    border: 1px solid #eeeeec;
    transition: border-color .15s ease;
  }

  .spn-ui-product-card:hover {
    border-color: #e1e1e1;
  }

  .spn-ui-product-card__content {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    outline-offset: 6px;
    outline: 2px dashed transparent;
    border-radius: .25rem;
  }

  .spn-ui-product-card__link:is(:visited, :link) {
    color: #212121;
    text-decoration: none;
  }

  .spn-ui-product-card__link:focus-visible {
    outline-color: #212121;
  }

  .spn-ui-product-card__link:hover .spn-ui-product-card__name {
    text-decoration: underline;
  }

  .spn-ui-product-card__media-container {
    position: relative;
  }

  .spn-ui-product-card__badge {
    --badge-inset-gap: .25rem;
    --badge-inset-block: var(--badge-inset-gap) auto auto var(--badge-inset-gap);
    position: absolute;
    inset: var(--badge-inset-block);
  }

  [data-position="top-right"].spn-ui-product-card__badge {
    --badge-inset-block: var(--badge-inset-gap) var(--badge-inset-gap) auto auto;
  }

  [data-position="bottom-left"].spn-ui-product-card__badge {
    --badge-inset-block: auto auto var(--badge-inset-gap) var(--badge-inset-gap);
  }

  [data-position="bottom-right"].spn-ui-product-card__badge {
    --badge-inset-block: auto var(--badge-inset-gap) var(--badge-inset-gap) auto;
  }

  .spn-ui-product-card__media {
    overflow: hidden;
    border-radius: .25rem;
    width: 100%;
    aspect-ratio: 1 / 1;
  }

  .spn-ui-product-card__description {
    display: flex;
    flex-direction: column;
    gap: .25rem;
  }

  .spn-ui-product-card__name {
    font-size: 0.875rem;
    line-height: 1.4;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    min-height: 2.4em;
  }

  .spn-ui-product-card__name:empty {
    display: none;
  }

  .spn-ui-product-card__price {
    display: flex;
    flex-direction: row;
    gap: .5rem;
  }

  .spn-ui-product-card__price-current {
    display: flex;
    flex-direction: row;
    gap: 0;
  }

  .spn-ui-product-card__price-symbol,
  .spn-ui-product-card__price-cents {
    font-size: .75rem;
    line-height: 1;
    align-self: start;
    margin-block-start: .125rem;
  }

  .spn-ui-product-card__price-dollars {
    line-height: 1;
    font-size: 1.5rem;
    font-weight: 500;
    align-self: start;
  }

  .spn-ui-product-card__price-original {
    font-size: .75rem;
    font-weight: 500;
    color: #515357;
    text-decoration: line-through;
    align-self: end;
  }

  .spn-ui-product-card__action {
    width: 100%;
    align-self: end;
    justify-self: end;
  }

  .spn-ui-product-card__action:empty {
    display: none;
  }
</style>
