<script lang="ts">
  import { type Snippet } from "svelte";
	import Card from "./Card.svelte";
	import Badge from "./Badge.svelte";
  import Icon from "./Icon.svelte";
  import { getRelativeTime } from "$lib/utils/relativeTime";

  type RecentData = {
		name: string;
		build_type: string;
		updated_at: string;
	};

  type Props = {
    data: RecentData;
  };

  let {
    data
  }: Props = $props();
</script>

<Card>
  <div class="recent-content">
    <div class="recent-content__thumbnail">
      <Icon size="32">
        <use href="#file-document-outline" />
      </Icon>
    </div>
    <span class="recent-content__name">{data.name}</span>
    <div class="recent-content__badges">
			<Badge size="sm">{data.build_type}</Badge>
		</div>
    <span class="recent-content__meta">
      <span class="recent-content__meta-label">Last edited</span>
      <span class="recent-content__timestamp">{getRelativeTime(data.updated_at)}</span>
    </span>
  </div>
</Card>

<style>
  .recent-content {
    display: grid;
    grid-template-columns: auto 1fr;
    grid-template-areas: 
      "thumbnail name name"
      "thumbnail badge meta";
    column-gap: .5rem;
    row-gap: .25rem;
    width: fit-content;
  }

  .recent-content__thumbnail {
    display: flex;
    align-items: center;
    justify-content: center;
    grid-area: thumbnail;
  }

  .recent-content__name {
    grid-area: name;
    line-height: 1.2;
    color: #212121;
  }

  .recent-content__badges {
    display: flex;
    align-items: center;
    grid-area: badge;
  }

  .recent-content__meta {
    display: flex;
    align-items: center;
    grid-area: meta;
    font-size: .75rem;
		color: #454545;
    gap: .5ch;
  }
  
  .recent-content__meta-label {
    line-height: 1;
  }

  .recent-content__timestamp {
    line-height: 1;
  }
</style>