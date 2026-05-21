<script lang="ts">
  import ProductCard, { type Props as ProductCardProps } from "./ProductCard.svelte";

  type Props = ProductCardProps & {
    [key: string]: unknown;
  };

  let {
    ...restProps
  }: Props = $props();
</script>

<wcag-ui-carousel-item>
  <ProductCard {...restProps} />
</wcag-ui-carousel-item>
