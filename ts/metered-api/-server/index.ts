import { Sphere, Price, Product, Subscription } from '../../../lib';
import express from 'express';
import { Request, Response } from 'express';
import http from 'http';

// Environment variables
const signer: string = process.env.SOLANA_PRIVATE_KEY || '';
const apiKey: string = process.env.SPHERE_API_KEY || '';

// Instantiate a Sphere client
const sphere: Sphere = new Sphere({
	env: 'devnet',
	signer,
	apiKey,
});

// An Interface to your subscription units tracking stores
class UnitsUsedInterface {
	// A function that takes in the pubkey of a user and a subscription id and returns the number of
	// units that the user has used for the current billing period.
	public static getUnitsUsedForPeriod = async (
		_subscription: Subscription
	): Promise<number> => 10_000;
}

// Event Data types
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

app.get('/', async (req: Request, res: Response) => {
	const topic: string = req.body.topic;
	if (topic != 'sphere.events.subscription.upcoming_billing') {
		res.status(200).json({});
		return;
	}
	const eventData: UpcomingBillingEventData = req.body;
	var subscription: Subscription = eventData.data.subscription;
	const unitsUsed: number = await UnitsUsedInterface.getUnitsUsedForPeriod(
		subscription
	);
	subscription = await sphere.subscription.updateUnits({
		id: subscription.id,
		units: unitsUsed,
	});
	console.log(
		`Updated subscription: ${subscription.id}'s billable units to ${subscription.billableUnits}`
	);
	res.status(200).json({});
});

server.listen(8080, () =>
	console.log(`Saas::billing::units:updater started on port`)
);
