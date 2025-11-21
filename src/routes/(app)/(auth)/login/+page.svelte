<script lang="ts">
	import { login } from "$lib/api/auth.remote";
	import { loginSchema } from "$lib/schema/auth";
	import Textfield from "$lib/components/Textfield.svelte";
	import Button from "$lib/components/Button.svelte";
  import Link from "$lib/components/Link.svelte";
  import debounce from "$lib/utils/debounced";
  import { message } from "valibot";

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

<div class="auth-card">
	<header class="auth-card__header">
		<svg class="auth-card__icon" width="96" height="96">
			<use href="/favicon.svg"></use>
		</svg>
		<h1 class="auth-card__title">Sign In to Build</h1>
		<p class="auth-card__subtitle">Let's create something amazing</p>
	</header>
	<form 
		class="auth-card__form" 
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
	<p class="auth-card__footer">
		Don't have an account?
		<Link href="/signup">Sign up</Link>
	</p>
</div>

<style>
	.auth-card {
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		display: flex;
		flex-flow: column nowrap;
		gap: 1rem;
		width: 100%;
  	max-width: min(100vw - 2rem, 26.25rem);
		background-color: #fff;
		border-radius: .75rem;
		padding-inline: 1rem;
		padding-block: 1rem;
		box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
	}

	.auth-card__header {
		display: flex;
		flex-flow: column nowrap;
		gap: .5rem;
		text-align: center;
		align-items: center;
		margin-block-end: 1rem;
	}

	.auth-card__form {
		display: flex;
		flex-flow: column nowrap;
		gap: 1rem;
		margin-block-end: .5rem;
	}

	.auth-card__title,
	.auth-card__subtitle {
		margin: 0;
		line-height: 1;
		user-select: none;
	}

	.auth-card__title {
		font-size: 1.5rem;
		font-weight: 700;
  	color: #1a1a1a;
	}

	.auth-card__subtitle {
		font-size: .875rem;
		color: #666;
	}

	.auth-card__footer {
		text-align: center;
	}

	@media (min-width: 768px) {
		.auth-card {
			top: 35%;
			padding-inline: 2.5rem;
			padding-block: 2.5rem;
		}
	}
</style>