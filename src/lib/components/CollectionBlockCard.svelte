<script lang="ts">
  import { BREAKPOINTS } from "$lib/constants/breakpoints";
  import Image from "./Image.svelte";
  import Card, { type Props as CardProps } from "./Card.svelte";

  type ImageSources = {
    mobile: string;
    tablet?: string;
    desktop?: string;
  };

  type Props = CardProps & {
    images?: ImageSources;
    alt?: string;
  };

  let {
    children,
    images,
    alt = "",
    ...props
  }: Props = $props();

  const resolvedImages = $derived.by(() => {
    if (!images) return null;
    const mobile = images.mobile ?? "";
    const tablet = images.tablet || mobile;
    const desktop = images.desktop || tablet;
    return { mobile, tablet, desktop };
  });
</script>

<wcag-ui-carousel-item>
  <Card {...props}>
    {#snippet media()}
      {#if resolvedImages}
        <picture>
          <source
            media="(min-width: {BREAKPOINTS.desktop}px)"
            srcset={resolvedImages.desktop}
          />
          <source
            media="(min-width: {BREAKPOINTS.tablet}px)"
            srcset={resolvedImages.tablet}
          />
          <Image src={resolvedImages.mobile} {alt} width={280} height={280} />
        </picture>
      {/if}
    {/snippet}
    {@render children?.()}
  </Card>
</wcag-ui-carousel-item>
