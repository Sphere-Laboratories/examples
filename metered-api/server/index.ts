import { Sphere, Price, Product, Subscription, logger } from '@spherelabs/sdk';
import http from 'http';
import bodyParser from "body-parser"
import express from 'express';

// Initialize Sphere Client
const sphere: Sphere = new Sphere({
	env: 'devnet',
	apiKey: process.env.SPHERE_API_KEY || '',
    signer: process.env.SOLANA_PRIVATE_KEY || '',
    rpcUrl: process.env.SOLANA_RPC_URL || ''
});

// Retrieve the billable units for the current period for a subscription.
const getUnitsUsedForPeriod = async (
	subscription: Subscription
): Promise<number> => 10_000;

// Event Data Type
type UpcomingBillingEventData = {
	hash: string;
	topic: string;
	data: {
		price: Price;
		product: Product;
		subscription: Subscription;
	};
	created: Date;
};

// Create an express app
const app: express.Express = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json())

// Create a single post endpoint 
app.post('/', async (req: express.Request, res: express.Response) => {
	var subscription: Subscription;
	var unitsUsed: number;
	try {
		const hash: string = req.body.hash;
		const topic: string = req.body.topic;
		console.log(`Injested event with topic: ${topic} and hash: ${hash}`)
		if (topic != 'sphere.events.subscription.upcoming_billing') {
			res.status(200).json({});
			return;
		}
		const eventData: UpcomingBillingEventData = req.body;
		subscription = eventData.data.subscription;
		unitsUsed = await getUnitsUsedForPeriod(subscription);
		subscription = await sphere.subscription.updateUnits({
			id: subscription.id,
			units: unitsUsed,
		});
		console.log(
			`Updated subscription: ${subscription.id}'s billable units to ${unitsUsed}`
		);
		res.status(200).json({});
	} catch (err) {
		console.log(
			`Could not update subscription: ${subscription.id}'s billable units to ${unitsUsed}`
		);
		res.status(500).json({});
	}
});

// Create and start server 
const server = http.createServer(app);
server.listen(8080, () =>
	console.log(`metered-api::server started on port: 8080`)
);
