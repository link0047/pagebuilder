<script lang="ts">
	import { signup } from "$lib/api/auth.remote";
	import { signupSchema } from "$lib/schema/auth";
	import AuthCard from "$lib/components/AuthCard.svelte";
	import Icon from "$lib/components/Icon.svelte";
	import Textfield from "$lib/components/Textfield.svelte";
	import Button from "$lib/components/Button.svelte";
  import Link from "$lib/components/Link.svelte";
  import debounce from "$lib/utils/debounced";

	const signupForm = signup.preflight(signupSchema);

	let hasSubmitted = $state(false);
	let activeField = $state<string | null>(null);

	function getFieldError(fieldName: "name" | "email" | "password") {
	const issues = signupForm.fields[fieldName].issues?.() ||[];

		if (activeField === fieldName) {
			return { hasError: false, message: undefined };
		}

		return {
			hasError: issues.length > 0,
			message: issues?.[0]?.message
		}
	}

	function handleSubmit() {
		hasSubmitted = true;
		validateInput.cancel();
	}

	function handleFocusIn({ target }: FocusEvent) {
    activeField = (target as HTMLInputElement).name;
  }

  function handleFocusOut({ target }: FocusEvent) {
    activeField = null;
    const input = target as HTMLInputElement;

    // Validate on blur if the user has tried to submit before OR if they've typed something
    if (hasSubmitted || input.value.length > 0) {
      signupForm.validate();
    }
  }

	const handleEnhance = signupForm.enhance(async ({ submit }) => {
  	hasSubmitted = true;
  	validateInput.cancel();
  	await submit();
  });

	const validateInput = debounce(() => {
		if (!hasSubmitted) return;

		signupForm.validate();
	}, 300);

	const fullnameError = $derived(getFieldError("name"));
	const emailError = $derived(getFieldError("email"));
	const passwordError = $derived(getFieldError("password"));
</script>

<AuthCard title="Create Account" subtitle="Get started with your page builder account">
	{#snippet icon()}
		<Icon size="96">
			<use href="/favicon.svg" />
		</Icon>
	{/snippet}
	<form
		class="signup-form"
		{...handleEnhance}
		oninput={validateInput}
		onsubmit={handleSubmit}
    onfocusin={handleFocusIn}
    onfocusout={handleFocusOut}
	>
		<Textfield
		  label="Full Name"
			{...signupForm.fields.name.as("text")}
			error={fullnameError.hasError}
			errorMessage={fullnameError.message}
		/>
		<Textfield
		  label="Email"
			{...signupForm.fields.email.as("email")}
			error={emailError.hasError}
			errorMessage={emailError.message}
		/>
		<Textfield
		  label="Password"
			{...signupForm.fields.password.as("password")}
			error={passwordError.hasError}
			errorMessage={passwordError.message}
			description="Must be at least 8 characters with a mix of letters and numbers"
		/>
		<Button type="submit" shape="pill" fullWidth loading={Boolean(signupForm.pending)}>
			Create Account
		</Button>
	</form>
	{#snippet footer()}
		<span class="signup-footer__text">Already have an account? <Link href="/login" underline="always">Sign in</Link></span>
	{/snippet}
</AuthCard>

<style>
	.signup-form {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.signup-footer__text {
    --wcag-ui-link-font-weight: 500;

    font-size: 0.875rem;
    color: #5d5d5d;
  }
</style>
