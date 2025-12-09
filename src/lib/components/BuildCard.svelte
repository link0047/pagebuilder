<script lang="ts">
  import { type Snippet } from "svelte";
	import Card from "./Card.svelte";
	import Badge from "./Badge.svelte";
	import Icon from "./Icon.svelte";
	import { getRelativeTime } from "$lib/utils/relativeTime";

  type BuildData = {
		name: string;
		build_type: string;
    author: string;
		updated_at: string;
	};

  type Props = {
    build: BuildData,
    actions?: Snippet;
  };

  let {
    build,
    actions
  }: Props = $props();
</script>

<Card>
  <div class="build-content">
		<h3 class="build-content__name">{build.name}</h3>
		<div class="build-content__badges">
			<Badge shape="pill">{build.build_type}</Badge>
		</div>
		<div class="build-content__meta">
			<span class="build-content__author">
				<Icon>
					<path d="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M7.07,18.28C7.5,17.38 10.12,16.5 12,16.5C13.88,16.5 16.5,17.38 16.93,18.28C15.57,19.36 13.86,20 12,20C10.14,20 8.43,19.36 7.07,18.28M18.36,16.83C16.93,15.09 13.46,14.5 12,14.5C10.54,14.5 7.07,15.09 5.64,16.83C4.62,15.5 4,13.82 4,12C4,7.59 7.59,4 12,4C16.41,4 20,7.59 20,12C20,13.82 19.38,15.5 18.36,16.83M12,6C10.06,6 8.5,7.56 8.5,9.5C8.5,11.44 10.06,13 12,13C13.94,13 15.5,11.44 15.5,9.5C15.5,7.56 13.94,6 12,6M12,11A1.5,1.5 0 0,1 10.5,9.5A1.5,1.5 0 0,1 12,8A1.5,1.5 0 0,1 13.5,9.5A1.5,1.5 0 0,1 12,11Z" />
				</Icon>
				by
				<span class="build-content__author-name">{build.author}</span>
			</span>
			<span class="build-content__separator">•</span>
			<span class="build-content__timestamp">{getRelativeTime(build.updated_at)}</span>
		</div>
    {#if actions}
      <div class="build-content__actions">
        {@render actions()}
      </div>
    {/if}
  </div> 
</Card>

<style>
  .build-content {
		display: flex;
		flex-direction: column;
		gap: .5rem;
		padding: .25rem;
	}

	.build-content__name {
		font-size: 1rem;
		margin: 0;
		line-height: 1;
	}

	.build-content__meta {
		font-size: .875rem;
		font-weight: 400;
    display: flex;
    align-items: center;
    color: #666;
	}

	.build-content__actions {
		display: flex;
		flex-direction: row;
		gap: .5rem;
	}
</style>