<script lang="ts">
	import { login } from "$lib/api/auth.remote";
	import { loginSchema } from "$lib/schema/auth";
	import AuthCard from "$lib/components/AuthCard.svelte";
	import Icon from "$lib/components/Icon.svelte";
	import Textfield from "$lib/components/Textfield.svelte";
	import Button from "$lib/components/Button.svelte";
  import Link from "$lib/components/Link.svelte";
  import debounce from "$lib/utils/debounced";

	const loginForm = login.preflight(loginSchema);
	
	type Field = typeof loginForm.fields.email;

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

		loginForm.validate();
	}, 300);

	const emailError = $derived(getFieldError(loginForm.fields.email, "email"));
	const passwordError = $derived(getFieldError(loginForm.fields.password, "password"));
</script>

<AuthCard title="Sign In to Build" subtitle="Let's create something amazing">
	{#snippet icon()}
		<Icon size="96">
			<use href="/favicon.svg" />
		</Icon>
	{/snippet}
	<form 
		class="form-layout" 
		{...loginForm.enhance(async ({ submit }) => {
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
				loginForm.validate();
			}
		}}
	>		
		<Textfield label="Email" {...loginForm.fields.email.as("email")} error={emailError.hasError} errorMessage={emailError.message} />
		<Textfield label="Password" {...loginForm.fields.password.as("password")} error={passwordError.hasError} errorMessage={passwordError.message} />
		<Button type="submit" fullWidth>
			Sign In
		</Button>
	</form>
	{#snippet footer()}
		<span>Don't have an account? <Link href="/signup">Sign up</Link></span>
	{/snippet}
</AuthCard>

<style>
	.form-layout {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}
</style>