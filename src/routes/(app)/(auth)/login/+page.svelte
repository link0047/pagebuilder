<script lang="ts">
	import { login } from "$lib/api/auth.remote";
</script>

<div class="auth">
	<h1>Log in</h1>

	<form {...login}>
		{#if login.result?.error}
			<p class="error">{login.result.error}</p>
		{/if}
		
		<label>
			Email
			<input {...login.fields.email.as("email")} />
			{#each login.fields.email.issues() ?? [] as issue}
				<p class="issue">{issue.message}</p>
			{/each}
		</label>

		<label>
			Password
			<input {...login.fields.password.as("password")} />
			{#each login.fields.password.issues() ?? [] as issue}
				<p class="issue">{issue.message}</p>
			{/each}
		</label>

		<p>
			Don't have an account?
			<a href="/signup">Sign up</a>
		</p>

		<button type="submit">Login</button>
	</form>
</div>