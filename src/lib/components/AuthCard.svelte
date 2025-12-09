<script lang="ts">
  import { type Snippet } from "svelte";

  type Props = {
    icon?: Snippet;
    children: Snippet;
    footer?: Snippet;
    title?: string;
    subtitle?: string;
  };

  let {
    icon,
    children,
    footer,
    title,
    subtitle
  }: Props = $props();
</script>

<div class="auth-card" aria-labelledby="auth-card-title">
	<header class="auth-card__header">
		{@render icon?.()}
    {#if title}
		  <h1 class="auth-card__title" id="auth-card-title">{title}</h1>
    {/if}
    {#if subtitle}
		  <p class="auth-card__subtitle">{subtitle}</p>
    {/if}
	</header>
	<div class="auth-card__content">
    {@render children()}
  </div>
  {#if footer}
    <footer class="auth-card__footer">
      {@render footer()}
    </footer>
  {/if}
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

	.auth-card__content {
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
    margin: 0;
		line-height: 1;
		font-size: 1.5rem;
		font-weight: 700;
  	color: #1a1a1a;
	}

	.auth-card__subtitle {
    margin: 0;
		line-height: 1;
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