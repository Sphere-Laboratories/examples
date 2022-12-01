import { Sphere, Price, Product, Subscription } from '@spherelabs/sdk';
import http from 'http';
import express from 'express';

// Instantiate a Sphere client
const sphere: Sphere = new Sphere({
	env: 'devnet',
	signer: process.env.SOLANA_PRIVATE_KEY || '',
	apiKey: process.env.SPHERE_API_KEY || '',
});

// Retrieves the billable units for the current period for a subscription.
const getUnitsUsedForPeriod = async (
	_subscription: Subscription
): Promise<number> => 10_000;

// Webhook event data types
type UpcomingBillingEventData = {
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
const server = http.createServer(app);

// Create a single post route for consuming all events
app.post('/', async (req: express.Request, res: express.Response) => {
	var subscription: Subscription;
	var unitsUsed: number;
	try {
		const topic: string = req.body.topic;
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

// Start server on port :8080
server.listen(8080, () =>
	console.log(`metered-api::service::units:updater started on port: 8080`)
);
