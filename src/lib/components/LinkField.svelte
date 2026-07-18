<script lang="ts">
  import Textfield from "./Textfield.svelte";
  import Checkbox from "./Checkbox.svelte";
  import Icon from "./Icon.svelte";

  // Matches Link.svelte's contract: `external` drives both target="_blank"
  // and rel="noopener noreferrer" there, so it stays one flag here too.
  export type LinkValue = { href?: string; external?: boolean };

  type Props = {
    label?: string;
    hideLabel?: boolean;
    placeholder?: string;
    /** Shown while the field is empty. */
    description?: string;
    value?: LinkValue;
    onUpdate?: (value: LinkValue) => void;
  };

  let {
    label = "Link URL",
    hideLabel = false,
    placeholder = "https://example.com",
    description,
    // $bindable so the field also works standalone, without a parent wiring
    // `onUpdate` back into `value`.
    value = $bindable({}),
    onUpdate
  }: Props = $props();

  const href = $derived(value?.href ?? "");
  const external = $derived(value?.external ?? false);
  const trimmed = $derived(href.trim());

  /**
   * A link is optional, so an empty field is fine. Anything present must
   * parse — either as an absolute URL or as a site-relative path, which is
   * what most internal links look like ("/category/outdoor-decor").
   */
  const status = $derived.by<"empty" | "valid" | "invalid">(() => {
    if (!trimmed) return "empty";
    if (trimmed.startsWith("/")) return "valid";
    if (URL.canParse(trimmed)) return "valid";
    return "invalid";
  });

  const isError = $derived(status === "invalid");

  function commit(next: LinkValue) {
    value = next;
    onUpdate?.(next);
  }

  function handleInput(event: Event) {
    const input = event.target as HTMLInputElement;
    commit({ ...value, href: input.value });
  }

  function handleExternal(event: Event) {
    const input = event.currentTarget as HTMLInputElement;
    commit({ ...value, external: input.checked });
  }
</script>

<div class="link-field" data-status={status}>
  <Textfield
    {label}
    {hideLabel}
    {placeholder}
    {description}
		passThroughSides="leading"
    value={href}
    type="text"
    error={isError}
    errorMessage="Enter a full URL (https://…) or a path starting with /"
    oninput={handleInput}
  >
    {#snippet leading()}
      <Icon size="1rem">
        <path d="M15.707 8.293a1 1 0 0 1 0 1.414l-6 6a1 1 0 1 1-1.414-1.414l6-6a1 1 0 0 1 1.414 0 M19.242 4.757c2.343 2.344 2.342 6.143-.052 8.534l-.534.464a1 1 0 1 1-1.312-1.51l.483-.416a4 4 0 0 0 0-5.657c-1.562-1.563-4.095-1.563-5.607-.054l-.463.536a1 1 0 1 1-1.514-1.308l.513-.59a6 6 0 0 1 8.486.001M6.75 10.338a1 1 0 0 1-.088 1.411l-.483.425a3.97 3.97 0 0 0 0 5.649 4.064 4.064 0 0 0 5.678.038l.34-.458a1 1 0 1 1 1.606 1.194l-.397.534-.1.114a6.07 6.07 0 0 1-8.533 0A5.97 5.97 0 0 1 3 14.998c0-1.595.638-3.124 1.814-4.284l.524-.463a1 1 0 0 1 1.411.087"/>
      </Icon>
    {/snippet}
  </Textfield>

  <!-- Only meaningful once there's a link to open. -->
  {#if trimmed}
    <Checkbox
      size="xs"
      checked={external}
      onchange={handleExternal}
    >
      Open in a new tab
    </Checkbox>
  {/if}
</div>

<style>
  .link-field {
    display: flex;
    flex-flow: column nowrap;
    gap: .5rem;

    --wcag-ui-textfield-icon-size: .875rem;
    --wcag-ui-icon-fill: #8a8a8a;
    --wcag-ui-textfield-input-background: #f7f7f7;
    --wcag-ui-textfield-input-border-color: #ebebeb;
    --wcag-ui-textfield-label-color: #8a8a8a;
  }

  .link-field[data-status="valid"] {
    --wcag-ui-icon-fill: #2680eb;
  }
</style>
