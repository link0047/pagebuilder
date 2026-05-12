<script module>
	const defaultIcons = {
    visible: "M12,9A3,3 0 0,1 15,12A3,3 0 0,1 12,15A3,3 0 0,1 9,12A3,3 0 0,1 12,9M12,4.5C17,4.5 21.27,7.61 23,12C21.27,16.39 17,19.5 12,19.5C7,19.5 2.73,16.39 1,12C2.73,7.61 7,4.5 12,4.5M3.18,12C4.83,15.36 8.24,17.5 12,17.5C15.76,17.5 19.17,15.36 20.82,12C19.17,8.64 15.76,6.5 12,6.5C8.24,6.5 4.83,8.64 3.18,12Z",
    hidden: "M2,5.27L3.28,4L20,20.72L18.73,22L15.65,18.92C14.5,19.3 13.28,19.5 12,19.5C7,19.5 2.73,16.39 1,12C1.69,10.24 2.79,8.69 4.19,7.46L2,5.27M12,9A3,3 0 0,1 15,12C15,12.35 14.94,12.69 14.83,13L11,9.17C11.31,9.06 11.65,9 12,9M12,4.5C17,4.5 21.27,7.61 23,12C22.18,14.08 20.79,15.88 19,17.19L17.58,15.76C18.94,14.82 20.06,13.54 20.82,12C19.17,8.64 15.76,6.5 12,6.5C10.91,6.5 9.84,6.68 8.84,7L7.3,5.47C8.74,4.85 10.33,4.5 12,4.5M3.18,12C4.83,15.36 8.24,17.5 12,17.5C12.69,17.5 13.37,17.43 14,17.29L11.72,15C10.29,14.85 9.15,13.71 9,12.28L5.6,8.87C4.61,9.72 3.78,10.78 3.18,12Z"
  }
</script>

<script lang="ts">
  import Textfield, { type Props as TextfieldProps } from "./Textfield.svelte";
  import Button from "./Button.svelte";
  import Icon from "./Icon.svelte";

  type IconPair = {
	  visible: string;
	  hidden: string;
	}

	type Props = Omit<TextfieldProps, "type" | "leading" | "trailing"> & {
    label?: string;
    value?: string | number;
    error?: boolean;
    ref?: HTMLInputElement;
    icons?: IconPair;
  }

	let {
	  label = "Password",
	  value = $bindable(),
	  error = $bindable(false),
	  ref = $bindable(),
	  icons = defaultIcons,
	  ...restProps
	}: Props = $props();

  let passwordVisible = $state(false);
  const iconPath = $derived(passwordVisible ? icons.hidden : icons.visible);
  const inputType = $derived(passwordVisible ? "text" : "password");
  const { type: _, ...safeRestProps } = $derived.by(() => restProps);
</script>

<Textfield
	{label}
	type={inputType}
	bind:value
	bind:error
	bind:ref
	{...safeRestProps}
>
  {#snippet trailing()}
    <Button
      shape="rounded-square"
      size="sm"
      variant="ghost"
      aria-label={passwordVisible ? "Hide password" : "Show password"}
      style="--wcag-ui-button-hover-bg-color:transparent;--wcag-ui-button-hover-border-color:transparent"
      onclick={() => passwordVisible = !passwordVisible}
    >
      <Icon size="20">
        <path d={iconPath} />
      </Icon>
    </Button>
  {/snippet}
</Textfield>
