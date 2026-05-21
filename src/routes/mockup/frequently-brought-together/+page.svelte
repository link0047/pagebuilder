<script lang="ts">
	import FrequentlyBroughtTogether from "$lib/components/FrequentlyBroughtTogether.svelte";

	type Product = {
		id: string;
		name: string;
		price: number;
		imageUrl: string;
		mobileImageUrl: string;
		url: string;
		selected?: boolean;
	}

	let products: Product[] = $state([
		{
			id: "04232153",
			name: "Black Rose 10-Function Massager 3 Inch - Hott Love",
			price: 44.99,
			imageUrl: "https://spencers.scene7.com/is/image/Spencers/04232153-a?wid=288&hei=288&fmt=webp",
			mobileImageUrl: "https://spencers.scene7.com/is/image/Spencers/04232153-a?wid=96&hei=96&fmt=webp",
			url: "/product/04232153",
			selected: true
		},
		{
			id: "04162061",
			name: "Love Bites Male Sensual Enhancement Gummies - 2 Count",
			price: 10.99,
			imageUrl: "https://spencers.scene7.com/is/image/Spencers/04162061-a?wid=288&hei=288&fmt=webp",
			mobileImageUrl: "https://spencers.scene7.com/is/image/Spencers/04162061-a?wid=96&hei=96&fmt=webp",
			url: "/product/04162061",
			selected: true
		},
		{
			id: "03783065",
			name: "Liquid Lust Water-Based Glide 4 oz. - Hott Love",
			price: 13.99,
			imageUrl: "https://spencers.scene7.com/is/image/Spencers/03783065-a?wid=288&hei=288&fmt=webp",
			mobileImageUrl: "https://spencers.scene7.com/is/image/Spencers/03783065-a?wid=96&hei=96&fmt=webp",
			url: "/product/03783065",
			selected: true
		}
	]);
</script>

<FrequentlyBroughtTogether bind:products={products} />
