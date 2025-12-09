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

	type Field = typeof signupForm.fields.email;

	let hasSubmitted = $state(false);
	let activeField = $state<string | null>(null);

	function getFieldError(field: Field, fieldName: string) {
		const issues = field.issues?.();
		const hasError = Array.isArray(issues) && issues.length > 0;

		if (activeField === fieldName) {
			return { hasError: false, message: undefined };
		}

		return {
			hasError,
			message: issues?.[0]?.message
		}
	}

	function handleSubmit() {
		// This runs on ANY submit attempt (valid or invalid).
		// This ensures we enable live validation even if the first click failed.
		hasSubmitted = true;
		validateInput.cancel(); // Don't run the debounce timer immediately after submit
	}

	const validateInput = debounce(() => {
		if (!hasSubmitted) return;

		signupForm.validate();
	}, 300);

	const fullnameError = $derived(getFieldError(signupForm.fields.name, "name"));
	const emailError = $derived(getFieldError(signupForm.fields.email, "email"));
	const passwordError = $derived(getFieldError(signupForm.fields.password, "password"));
</script>

<AuthCard title="Create Account" subtitle="Get started with your page builder account">
	{#snippet icon()}
		<Icon size="96">
			<use href="/favicon.svg" />
		</Icon>
	{/snippet}
	<form
		class="form-layout"
		{...signupForm.enhance(async ({ submit }) => {
			hasSubmitted = true;
			validateInput.cancel();
			await submit();
		})}
		oninput={validateInput}
		onsubmit={handleSubmit}
		onfocusin={(e) => activeField = (e.target as HTMLInputElement).name}
		onfocusout={(e) => {
			activeField = null;

			const input = e.target as HTMLInputElement;
			const hasInput = input.value.length > 0;

			if (hasSubmitted || hasInput) {
				signupForm.validate();
			}
		}}
	>
		<Textfield label="Full Name" {...signupForm.fields.name.as("text")} error={fullnameError.hasError} errorMessage={fullnameError.message} />
		<Textfield label="Email" {...signupForm.fields.email.as("email")} error={emailError.hasError} errorMessage={emailError.message} />
		<Textfield label="Password" {...signupForm.fields.password.as("password")} error={passwordError.hasError} errorMessage={passwordError.message} description="Must be at least 8 characters with a mix of letters and numbers"/>
		<Button type="submit" fullWidth>
			Create Account
		</Button>
	</form>
	{#snippet footer()}
		<span>Already have an account? <Link href="/login">Sign in</Link></span>
	{/snippet}
</AuthCard>

<style>
	.form-layout {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}
</style>