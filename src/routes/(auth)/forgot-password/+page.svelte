<script lang="ts">
  import AuthCard from "$lib/components/AuthCard.svelte";
  import Icon from "$lib/components/Icon.svelte";
  import Textfield from "$lib/components/Textfield.svelte";
  import Button from "$lib/components/Button.svelte";
  import Link from "$lib/components/Link.svelte";
  import { forgotPassword } from "$lib/api/auth.remote";
  import { forgotPasswordSchema } from "$lib/schema/auth";
  import debounce from "$lib/utils/debounced";

  const forgotPasswordForm = forgotPassword.preflight(forgotPasswordSchema);

  let hasSubmitted = $state(false);
  let activeField = $state<string | null>(null);

  function getFieldError(fieldName: "email") {
    const issues = forgotPasswordForm.fields[fieldName].issues?.() ||[];

    if (activeField === fieldName) {
      return { hasError: false, message: undefined };
    }

    return {
      hasError: issues.length > 0,
      message: issues[0]?.message,
    };
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
      forgotPasswordForm.validate();
    }
  }

 	const handleEnhance = forgotPasswordForm.enhance(async ({ submit }) => {
   	hasSubmitted = true;
   	validateInput.cancel();
   	await submit();
  });

 	const validateInput = debounce(() => {
		if (!hasSubmitted) return;

		forgotPasswordForm.validate();
 	}, 300);

  const emailError = $derived(getFieldError("email"));
</script>

<svelte:head>
  <title>Forgot Password - Page Builder</title>
</svelte:head>

<AuthCard title="Forgot Password">
  {#snippet icon()}
    <Icon size="96">
      <use href="/favicon.svg" />
    </Icon>
  {/snippet}
  <form
    class="forgot-form"
    {...handleEnhance}
    oninput={validateInput}
    onsubmit={handleSubmit}
    onfocusin={handleFocusIn}
    onfocusout={handleFocusOut}
  >
    <Textfield
      label="Email"
      {...forgotPasswordForm.fields.email.as("email")}
      error={emailError.hasError}
      errorMessage={emailError.message}
    />
    <div class="forgot-form__actions">
      <Button type="submit" shape="pill" fullWidth loading={Boolean(forgotPasswordForm.pending)}>
        Reset Password
      </Button>
      <Link href="/login">
        <Icon size="16">
          <path d="M21,11H6.83L10.41,7.41L9,6L3,12L9,18L10.41,16.58L6.83,13H21V11Z" />
        </Icon>
        Back to Login
      </Link>
    </div>
  </form>
</AuthCard>

<style>
  .forgot-form {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .forgot-form__actions {
    display: flex;
    flex-direction: column;
    gap: .5rem;
    font-size: .875rem;
  }
</style>
