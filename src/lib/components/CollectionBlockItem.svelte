<script lang="ts">
  import ProductCard, { type Props as ProductCardProps } from "./ProductCard.svelte";

  type Props = {
    product?: ProductCardProps;
    [key: string]: unknown;
  };

  let { product }: Props = $props();
</script>

{#if product}
  {@const { href, src = { mobile: "" }, name, price, badge } = product}
  {@const originalPrice = Number(price?.original) || 0}
  {@const salePrice = price?.sale !== null && price?.sale !== undefined
    ? Number(price.sale) || null
    : null}

  <wcag-ui-carousel-item>
    <ProductCard
      href={href}
      src={src}
      name={name ?? ""}
      price={{ original: originalPrice, sale: salePrice }}
      badge={badge?.text ? badge : undefined}
    />
  </wcag-ui-carousel-item>
{/if}
