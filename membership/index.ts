// TODO: Coming Soon

// ## I. Flat Membership Subscriptions

// Suppose your company offers a service that you would like to charge a monthly flat subscription on. For example, higher request limits for your API, a paid tier for premium analytics and services, or even access to a private Discord channel.

// Let's say you have two tiers:

// 1) Basic - $10 dollars a month
// 2) Pro - $250 dollars a year

// Additionally, you'd like to give your users a 7 day trial period.

import { Sphere, Price, Product, Faucet } from '@spherelabs/sdk';

(async () => {
	// Instantiate a Sphere client
	const sphere: Sphere = new Sphere({
		env: 'devnet',
		signer: process.env.SOLANA_PRIVATE_KEY || '',
		apiKey: process.env.SPHERE_API_KEY || '',
	});

	// Create a currency and airdrop SOL to the merchant
	const faucet = new Faucet({
		env: 'devnet',
		signer: process.env.SOLANA_PRIVATE_KEY || '',
		rpcUrl: process.env.SOLANA_RPC_URL || '',
	});
	await faucet.airdropSol();
	await faucet.initialize();
	const currency = faucet.currency;

	// Create basic membership price
	const basicPlan: Price = await sphere.price.create({
		name: 'Basic Plan',
		description: 'A monthly membership to our basic trading insights',
		currency,
		mutable: true,
		meta: {
			uuid: 'PERP_UFQKFG',
		},
		flatPrice: 50,
		type: 'recurring',
		unitTiers: [],
		seatTiers: [],
		billingPeriod: '30-d',
		trialPeriod: '7-d',
		taxRate: 0.05,
		taxInclusive: false,
	});
	console.log(`basicPlan created with id:${basicPlan.id}`);

	// Create pro membership price
	const proPlan: Price = await sphere.price.create({
		name: 'Pro Plan',
		description: 'A yearly membership to our advanced trading insights',
		currency,
		mutable: true,
		meta: {
			uuid: 'PERP_UFQKFG',
		},
		flatPrice: 50,
		type: 'recurring',
		unitTiers: [],
		seatTiers: [],
		billingPeriod: '365-d',
		trialPeriod: '7-d',
		taxRate: 0.05,
		taxInclusive: false,
	});
	console.log(`proPlan created with id:${proPlan.id}`);

	// Create a subscription product with the prices
	const product: Product = await sphere.product.create({
		name: 'Trading Insights',
		description: `The most advanced analytics and trading platform.`,
		images: [
			'https://docs.sphere.engineer/recurring-membership-1.png',
			'https://docs.sphere.engineer/recurring-membership-2.png',
			'https://docs.sphere.engineer/recurring-membership-3.png',
		],
		meta: {},
		mutable: true,
		defaultPrice: basicPlan.id,
		prices: [basicPlan.id, proPlan.id],
		shippable: false,
		taxIncluded: false,
		maxSupply: 1_000_000,
	});
	console.log(`product created with id:${product.id}`);

	// Log the product page
	console.log(product.url);
})();
