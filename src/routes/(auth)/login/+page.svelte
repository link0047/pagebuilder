<script lang="ts">
  import { onMount } from "svelte";
  import { SvelteSet } from "svelte/reactivity";
  import { login } from "$lib/api/auth.remote";
  import { loginSchema } from "$lib/schema/auth";
  import AuthCard from "$lib/components/AuthCard.svelte";
  import Icon from "$lib/components/Icon.svelte";
  import Textfield from "$lib/components/Textfield.svelte";
  import PasswordField from "$lib/components/PasswordField.svelte";
  import Button from "$lib/components/Button.svelte";
  import Link from "$lib/components/Link.svelte";
  import debounce from "$lib/utils/debounced";
  import { beforeNavigate } from "$app/navigation";

  type FormStatus = "idle" | "loading" | "error" | "success";

  const loginForm = login.preflight(loginSchema);

  let formRef: HTMLFormElement | null = null;
  let hasSubmitted = $state(false);
  let activeField = $state<string | null>(null);
  let status = $state<FormStatus>("idle");
  let serverErrorMessage = $state<string | null>(null);
  const modifiedSinceLastSubmit = new SvelteSet<string>();

  function getFieldError(fieldName: "email" | "password") {
    const issues = loginForm.fields[fieldName].issues?.() || [];
    const isModified = modifiedSinceLastSubmit.has(fieldName);

    if (status === "loading" || status === "success" || loginForm.pending) {
      return { hasError: false };
    }


    const shouldShowServerError = status === "error" && !isModified && issues.length === 0;
    const currentServerError = (shouldShowServerError && fieldName === "password")
      ? serverErrorMessage
      : null;

    const hasError = issues.length > 0 || !!currentServerError;
    const message = issues?.[0]?.message ?? currentServerError;

    if (activeField === fieldName) {
      return { hasError: false, message: undefined };
    }

    return { hasError, message };
  }

  function handleSubmit() {
    hasSubmitted = true;
    activeField = null;
    loginForm.validate();
    validateInput.cancel();
  }

  function handleInput({ target }: Event) {
    const name = (target as HTMLInputElement).name;
    modifiedSinceLastSubmit.add(name);
    validateInput();
  }

  function handleFocusIn({ target }: FocusEvent) {
    activeField = (target as HTMLInputElement).name;
  }

  function handleFocusOut({ target }: FocusEvent) {
    activeField = null;
    const input = target as HTMLInputElement;

    // Validate on blur if the user has tried to submit before OR if they've typed something
    if (hasSubmitted || input.value.length > 0) {
      loginForm.validate();
    }
  }

  const handleEnhance = loginForm.enhance(async ({ submit }) => {
    serverErrorMessage = null;
    status = "loading";
    hasSubmitted = true;
    modifiedSinceLastSubmit.clear();
    validateInput.cancel();

    await submit();

    if (loginForm.result?.error) {
      serverErrorMessage = loginForm.result.error;
      status = "error";
    }
  });

  const validateInput = debounce(() => {
    if (hasSubmitted) loginForm.validate();
  }, 300);

  const emailError = $derived(getFieldError("email"));
  const passwordError = $derived(getFieldError("password"));

  beforeNavigate(() => {
    serverErrorMessage = null;
    status = "idle";
  });

  onMount(() => {
    status = "idle";
    hasSubmitted = false;
    serverErrorMessage = null;
    modifiedSinceLastSubmit.clear();
    formRef?.reset();
  });
</script>

<AuthCard title="Sign In to Build" subtitle="Let's create something amazing">
  {#snippet icon()}
    <Icon size="96">
      <use href="/favicon.svg" />
    </Icon>
  {/snippet}
  <form
    bind:this={formRef}
    class="login-form"
    {...handleEnhance}
    oninput={handleInput}
    onsubmit={handleSubmit}
    onfocusin={handleFocusIn}
    onfocusout={handleFocusOut}
  >
    <Textfield
      label="Email"
      {...loginForm.fields.email.as("email")}
      error={emailError.hasError}
      errorMessage={emailError.message}
      readOnly={Boolean(loginForm.pending)}
    />
    <PasswordField
      {...loginForm.fields.password.as("password")}
      error={passwordError.hasError}
      errorMessage={passwordError.message}
      readOnly={Boolean(loginForm.pending)}
    />
    <Button type="submit" fullWidth loading={Boolean(loginForm.pending)}>
      Sign In
    </Button>
  </form>
  {#snippet footer()}
    <span class="login-footer__text">Don't have an account? <Link href="/signup">Sign up</Link></span>
  {/snippet}
</AuthCard>

<style>
  .login-form {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .login-footer__text {
    font-size: 0.875rem;
    color: #5d5d5d;
  }
</style>
