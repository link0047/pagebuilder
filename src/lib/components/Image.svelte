<script lang="ts">
	type LoadingStrategy = "lazy" | "eager";
	type DecodingStrategy = "async" | "sync" | "auto";
	type FetchPriority = "high" | "low" | "auto";

	type WarningType = {
	  type: "missingSource" | "missingAlt" | "loadError";
	  message: string;
	  src?: string;
	}
	
	type Props = {
	  src: string | undefined;
	  width: number;
	  height: number;
	  loading?: LoadingStrategy;
	  decoding?: DecodingStrategy;
	  alt: string;
	  fetchpriority?: FetchPriority;
	  onError?: (src?: string) => void;
		onWarning?: (warning: WarningType) => void;
		showWarnings?: boolean;
		useFallback?: boolean;
		fallbackSrc?: string;
		[key: string]: unknown;
	}
	
	const DEFAULT_WIDTH = 300;
	const DEFAULT_HEIGHT = 300;
	const DEFAULT_PLACEHOLDER = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="300" height="300" fill="lightgray"><text x="50%" y="50%" text-anchor="middle" alignment-baseline="middle" font-family="Arial" font-size="20">No Image</text></svg>`;
	
	let {
	  src,
	  width = DEFAULT_WIDTH,
	  height = DEFAULT_HEIGHT,
	  loading = "lazy",
	  decoding = "async",
	  alt,
	  fetchpriority = loading === "eager" ? "high" : "auto",
	  onError,
		onWarning,
		showWarnings = false,
		useFallback = true,
		fallbackSrc = DEFAULT_PLACEHOLDER,
	  ...restProps
	}: Props = $props();

	if (src === undefined) {
		const warning: WarningType = {
			type: "missingSource",
			message: "🚨 Image component requires a source (src) attribute. Provide a valid image URL or path."
		};
		
		showWarnings && console.warn(warning.message);
    onWarning?.(warning);
	}
	
	if (alt === undefined) {
	  const warning: WarningType = {
	    type: "missingAlt",
	    message: `🌐 Accessibility Issue: Missing alt text for image. Add descriptive alternative text.`
	  };
	  
	  showWarnings && console.warn(warning.message);
    onWarning?.(warning);
	}

	function handleError() {
	  const warning: WarningType = {
	    type: "loadError",
	    message: `❌ Failed to load image from: ${src}. Fallback placeholder will be used.`,
	    src
	  };
	  
	  showWarnings && console.warn(warning.message);
	  onWarning?.(warning);
	  onError?.(src);
	  src = useFallback ? fallbackSrc : src;
	}
</script>

<img
  class="image"
  {src}
  {width}
  {height}
  {loading}
  {decoding}
  {alt}
  {fetchpriority}
  {...restProps}
	onerror={handleError}
/>

<style>
  :root {
    /* Image Container Variables */
    --uikit-image-max-width: 100%;
    --uikit-image-height: auto;
		--uikit-image-object-fit: contain;
    --uikit-image-border-radius: 0;
    
    /* Print Media Variables */
    --uikit-image-print-max-width: 100%;
    --uikit-image-print-color-adjust: exact;
  }

  .image {
    display: block;
		width: 100%;
    max-width: var(--uikit-image-max-width);
    height: var(--uikit-image-height);
    object-fit: var(--uikit-image-object-fit);
    border-radius: var(--uikit-image-border-radius);
    contain: content;
		font-style: italic;
		background-color: #f2f2f2;
  }

  @media print {
    .image {
      max-width: var(--uikit-image-print-max-width) !important;
      break-inside: avoid;
      -webkit-print-color-adjust: var(--uikit-image-print-color-adjust);
      print-color-adjust: var(--uikit-image-print-color-adjust);
    }
  }
</style>