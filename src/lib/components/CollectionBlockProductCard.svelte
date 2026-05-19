<script lang="ts">
  import ProductCard, { type Props as ProductCardProps } from "./ProductCard.svelte";

  type Props = ProductCardProps;
  let { ...props }: Props = $props();
</script>

<wcag-ui-carousel-item>
  <ProductCard {...props} />
</wcag-ui-carousel-item>
