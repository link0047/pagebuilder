<script lang="ts">
  import Textfield from "./Textfield.svelte";
  import Icon from "./Icon.svelte";

  type Props = {
    label?: string;
		hideLabel?: boolean;
    placeholder?: string;
    description?: string;
    value?: string;
    onUpdate?: (value: string) => void;
  };

  let {
    label = "Image URL",
		hideLabel = false,
    placeholder,
    description,
    value = $bindable(""),
    onUpdate,
  }: Props = $props();

  const trimmed = $derived((value ?? "").trim());

  /**
   * Validation logic:
   * 1. If empty -> "empty"
   * 2. If valid URL structure -> "valid"
   * 3. Otherwise -> "invalid"
   */
  const status = $derived.by<"empty" | "valid" | "invalid">(() => {
    if (!trimmed) return "empty";
    if (URL.canParse(trimmed)) return "valid";
    return "invalid";
  });

  const isError = $derived(status === "invalid");
  const hasHint = $derived(status === "valid" || (status === "empty" && !!description));

  function handleInput(event: Event) {
    const input = event.target as HTMLInputElement;
    let newValue = input.value;

    // Check if the user starts typing http:// and upgrade it
    if (newValue.toLowerCase().startsWith("http://")) {
      newValue = newValue.replace(/^http:\/\//i, "https://");
    }

    value = newValue; // Updates the Textfield via bindable value
    onUpdate?.(newValue);
  }
</script>

{#snippet Hint()}
  {#if status === "valid"}
    <span class="image-url__hint image-url__hint--ok">
      <Icon size="1rem">
				<path d="M21,7L9,19L3.5,13.5L4.91,12.09L9,16.17L19.59,5.59L21,7Z" />
			</Icon>
      Valid URL
    </span>
  {:else if description}
    {description}
  {/if}
{/snippet}

<div class="image-url" data-status={status}>
  <Textfield
    {label}
		{hideLabel}
    {placeholder}
    {value}
		passThroughSides="leading"
    type="url"
    error={isError}
    errorMessage="Please enter a valid URL (e.g., https://example.com/image.jpg)"
    description={hasHint ? Hint : undefined}
    oninput={handleInput}
  >
    {#snippet leading()}
      <Icon size="1rem">
        <path d="M15.707 8.293a1 1 0 0 1 0 1.414l-6 6a1 1 0 1 1-1.414-1.414l6-6a1 1 0 0 1 1.414 0 M19.242 4.757c2.343 2.344 2.342 6.143-.052 8.534l-.534.464a1 1 0 1 1-1.312-1.51l.483-.416a4 4 0 0 0 0-5.657c-1.562-1.563-4.095-1.563-5.607-.054l-.463.536a1 1 0 1 1-1.514-1.308l.513-.59a6 6 0 0 1 8.486.001M6.75 10.338a1 1 0 0 1-.088 1.411l-.483.425a3.97 3.97 0 0 0 0 5.649 4.064 4.064 0 0 0 5.678.038l.34-.458a1 1 0 1 1 1.606 1.194l-.397.534-.1.114a6.07 6.07 0 0 1-8.533 0A5.97 5.97 0 0 1 3 14.998c0-1.595.638-3.124 1.814-4.284l.524-.463a1 1 0 0 1 1.411.087"/>
      </Icon>
    {/snippet}
  </Textfield>
</div>

<style>
  .image-url {
    --wcag-ui-textfield-icon-size: .875rem;
    --wcag-ui-icon-fill: #8a8a8a;
    --wcag-ui-textfield-input-background: #f7f7f7;
    --wcag-ui-textfield-input-border-color: #ebebeb;
    --wcag-ui-textfield-label-color: #8a8a8a;
  }

  .image-url[data-status="valid"] :global(.wcag-ui-textfield__leading) {
    color: #2680eb;
  }

	.image-url[data-status="valid"] {
    --wcag-ui-icon-fill: #2680eb;
  }

  .image-url__hint {
    display: inline-flex;
    align-items: center;
    gap: 0.25rem;
  }

  .image-url__hint--ok {
		--wcag-ui-icon-fill: #1a8245;
    color: #1a8245;
  }
</style>
