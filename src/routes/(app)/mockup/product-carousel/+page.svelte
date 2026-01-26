<script lang="ts">
	import CollectionBlock from "$lib/components/CollectionBlock.svelte";
	import CollectionBlockItem from "$lib/components/CollectionBlockItem.svelte";

	const products = [{
		"src": {
			"desktop": "https://spencers.scene7.com/is/image/Spencers/04559738%2Da?fmt=webp&wid=300&hei=300",
			"mobile": "https://spencers.scene7.com/is/image/Spencers/04559738%2Da?fmt=webp&wid=300&hei=300"
		},
		"name": "Five Nights at Freddy's Characters T Shirt",
		"price": {
			"original": 19.99,
			"sale": 14.99
		},
		"badge": "New lower price"
	}, {
		"src": {
			"desktop": "https://spencers.scene7.com/is/image/Spencers/08608945%2Da?fmt=webp&wid=300&hei=300",
			"mobile": "https://spencers.scene7.com/is/image/Spencers/08608945%2Da?fmt=webp&wid=300&hei=300"
		},
		"name": "Stranger Things WSQK The Squawk T Shirt",
		"price": {
			"original": 24.99,
			"sale": null
		}
	}, {
		"src": {
			"desktop": "https://spencers.scene7.com/is/image/Spencers/04662813%2Db?fmt=webp&wid=300&hei=300",
			"mobile": "https://spencers.scene7.com/is/image/Spencers/04662813%2Db?fmt=webp&wid=300&hei=300"
		},
		"name": "Fallout: New Vegas Gambling",
		"price": {
			"original": 23.99,
			"sale": null
		}
	}, {
		"src": {
			"desktop": "https://spencers.scene7.com/is/image/Spencers/04789871%2Da?fmt=webp&wid=300&hei=300",
			"mobile": "https://spencers.scene7.com/is/image/Spencers/04789871%2Da?fmt=webp&wid=300&hei=300"
		},
		"name": "Dexter Bay Harbor Butcher T Shirt",
		"price": {
			"original": 19.99,
			"sale": null
		},
		"badge": "Bestseller"
	}, {
		"src": {
			"desktop": "https://spencers.scene7.com/is/image/Spencers/04703450%2Da?fmt=webp&wid=300&hei=300",
			"mobile": "https://spencers.scene7.com/is/image/Spencers/04703450%2Da?fmt=webp&wid=300&hei=300"
		},
		"name": "Gorillaz Wired Cover T Shirt",
		"price": {
			"original": 19.99,
			"sale": null
		}
	}, {
		"src": {
			"desktop": "https://spencers.scene7.com/is/image/Spencers/04714705%2Da?fmt=webp&wid=300&hei=300",
			"mobile": "https://spencers.scene7.com/is/image/Spencers/04714705%2Da?fmt=webp&wid=300&hei=300"
		},
		"name": "Got Too Silly T Shirt - Teen Hearts",
		"price": {
			"original": 19.99,
			"sale": null
		}
	}, {
		"src": {
			"desktop": "https://spencers.scene7.com/is/image/Spencers/04813978%2Da?fmt=webp&wid=300&hei=300",
			"mobile": "https://spencers.scene7.com/is/image/Spencers/04813978%2Da?fmt=webp&wid=300&hei=300"
		},
		"name": "I Got that Nyan in Me T Shirt - Nyan Cat",
		"price": {
			"original": 19.99,
			"sale": null
		}
	}, {
		"src": {
			"desktop": "https://spencers.scene7.com/is/image/Spencers/04881009%2Da?fmt=webp&wid=300&hei=300",
			"mobile": "https://spencers.scene7.com/is/image/Spencers/04881009%2Da?fmt=webp&wid=300&hei=300"
		},
		"name": "Deftones Private Music T Shirt",
		"price": {
			"original": 19.99,
			"sale": null
		}
	}, {
		"src": {
			"desktop": "https://spencers.scene7.com/is/image/Spencers/04786497%2Da?fmt=webp&wid=300&hei=300",
			"mobile": "https://spencers.scene7.com/is/image/Spencers/04786497%2Da?fmt=webp&wid=300&hei=300"
		},
		"name": "ITrained in Combat Anxiety Attacks T Shirt",
		"price": {
			"original": 19.99,
			"sale": null
		}
	}, {
		"src": {
			"desktop": "https://spencers.scene7.com/is/image/Spencers/04831269%2Da?fmt=webp&wid=300&hei=300",
			"mobile": "https://spencers.scene7.com/is/image/Spencers/04831269%2Da?fmt=webp&wid=300&hei=300"
		},
		"name": "Ozzy Ozbourne Middle Finger T Shirt",
		"price": {
			"original": 19.99,
			"sale": null
		}
	}];
</script>

<CollectionBlock heading="Shop Top Tees">
	{#each products as product}
		<CollectionBlockItem {product} />
	{/each}
</CollectionBlock>
