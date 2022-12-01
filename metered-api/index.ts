import { Sphere, Price, Product, Faucet } from '@spherelabs/sdk';

(async () => {
	// Instantiate a Sphere client
	const sphere = new Sphere({
		env: 'devnet',
		apiKey: process.env.SPHERE_API_KEY || '',
		signer: process.env.SOLANA_PRIVATE_KEY || '',
		rpcUrl: process.env.SOLANA_RPC_URL || '',
	});

	// Register Webhook API
	await sphere.registerAPI('http://localhost:8080');

	// Create a currency and airdrop SOL to the merchant
	const faucet = new Faucet({
		env: 'devnet',
		signer: process.env.SOLANA_PRIVATE_KEY || '',
		rpcUrl: process.env.SOLANA_RPC_URL || '',
	});
	await faucet.airdropSol();
	await faucet.initialize();
	const currency = faucet.currency;

	// Create free plan price
	const freePlan: Price = await sphere.price.create({
		name: 'Free Plan',
		description: 'Ideally suited for prototyping and low-volume use-cases.',
		currency,
		mutable: true,
		meta: {
			uuid: 'HELIUS_IFQKFG',
		},
		flatPrice: 0,
		type: 'recurring',
		unitTiers: [
			{
				units: 100_000,
				pricePerUnit: 0,
			},
			{
				units: 1_000_000,
				pricePerUnit: 0.000005,
			},
			{
				units: 10_0000_000,
				pricePerUnit: 0.000007,
			},
		],
		seatTiers: [],
		billingPeriod: '30-d',
		trialPeriod: '0-s',
		taxRate: 0.05,
		taxInclusive: false,
	});
	console.log(`freePlan created with id:${freePlan.id}`);

	// Create developer plan price
	const developerPlan: Price = await sphere.price.create({
		name: 'Developer Plan',
		description: `Perfect for individual developers, side projects and hackathons. 
                   Includes 3 webhooks, 3 API requests per second, 300 RPC requests 
                   per second, 20 million credits per month, and auto-scaling at 
                   $0.00069 for each additional 100 credits.`,
		currency,
		mutable: true,
		meta: {
			uuid: 'HELIUS_TJGKDD',
		},
		flatPrice: 69,
		type: 'recurring',
		unitTiers: [
			{
				units: 20_000_000,
				pricePerUnit: 0,
			},
			{
				units: 50_000_000,
				pricePerUnit: 0.000005,
			},
		],
		seatTiers: [],
		billingPeriod: '30-d',
		trialPeriod: '0-s',
		taxRate: 0.05,
		taxInclusive: false,
	});
	console.log(`developerPlanPrice created with id:${developerPlan.id}`);

	// Create a business plan price
	const businessPlan: Price = await sphere.price.create({
		name: 'Business Plan',
		description: `Great for businesses, startups, and advanced developers. 
                   Includes 10 webhooks, unlimited rate limit scaling, 200 million
                   credits per month, auto-scaling at $0.00039 for each additional 
                   100 credits exceeding the limit, priority support, and priority
                   protocol parsing.`,
		currency,
		mutable: true,
		meta: {
			uuid: 'HELIUS_GUJGDDG',
		},
		flatPrice: 399,
		type: 'recurring',
		unitTiers: [
			{
				units: 120_000_000,
				pricePerUnit: 0,
			},
			{
				units: 250_000_000,
				pricePerUnit: 0.000007,
			},
		],
		seatTiers: [],
		billingPeriod: '30-d',
		trialPeriod: '1-s',
		taxRate: 0.05,
		taxInclusive: false,
	});
	console.log(`businessPlanPrice created with id:${businessPlan.id}`);

	// Create a subscription product with the prices
	const product: Product = await sphere.product.create({
		name: 'SaaS Subscription',
		description: `Our powerful APIs, webhooks, and RPCs save you the headache of 
                  dealing with cryptic on-chain data & expensive indexers, so you
                  can focus on your product. Leverage the full power of Solana.`,
		images: ['https://docs.sphere.engineer/recurring-saas-service.png'],
		meta: {},
		mutable: true,
		defaultPrice: freePlan.id,
		prices: [freePlan.id, developerPlan.id, businessPlan.id],
		shippable: false,
		taxIncluded: false,
		maxSupply: 1_000_000,
	});
	console.log(`product created with id:${product.id}`);

	// Console log the subscription checkout page for your product
	console.log(product.url);
})();
