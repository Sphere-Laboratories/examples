import { Sphere, Invoice, Faucet } from '@spherelabs/sdk';

export const createInvoiceWithPrice = async () => {
	// Instantiate a Sphere Client (signer=merchant)
	const sphere = new Sphere({
		env: 'devnet',
		apiKey: process.env.SPHERE_API_KEY || '',
		signer: process.env.SOLANA_PRIVATE_KEY || '',
		rpcUrl: process.env.SOLANA_RPC_URL || '',
	});

	// Create a Devnet Currency and Token Faucet
	await sphere.faucet.initialize();

	const currency = sphere.faucet.currency;

	// Create a Price
	const price: Price = await sphere.price.create({
		name: 'Invoice Price',
		description: 'A price for an invoice',
		currency,
		mutable: true,
		flatPrice: 10,
		type: 'oneTime',
		unitTiers: [],
		seatTiers: [],
		billingPeriod: '30-d',
		trialPeriod: '30-d',
		taxRate: 0.05,
		taxInclusive: false,
	});
	console.log(`invoice price created with id: ${price.id}`);

	// Create an invoice.
	var invoice: Invoice = await sphere.invoice.create({
		name: 'Your first invoice',
		description: `An invoice is a document given to the buyer by the seller
				 to collect payment. It includes the cost of the products 
				 purchased or services rendered to the buyer. Invoices can 
				 also serve as legal records, if they contain the names of 
				 the seller and client, description and price of goods or 
				 services, and the terms of payment.`,
		meta: {},
		price: price.id,
		currency,
		amount: 0,
	});
	console.log(`Created invoice with id: ${invoice.id}`);

	// Console log the url for the Sphere hosted ui for the invoice.
	console.log(invoice.url);
};
