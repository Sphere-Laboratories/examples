import { expect } from 'chai';
import { createFaucet } from '../createFaucet';
import { createInvoiceWithPrice } from '../createInvoice';
import { recurringPaymentsMembership } from '../recurringPaymentsMembership';
import { recurringPaymentsMeteredAPI } from '../recurringPaymentsMeteredAPI';

export const MAX_TIME_TO_EXECUTE_MS = 7 * 1_000;

describe('🍬 Examples Should Execute Successfully', () => {
	it('✨  createFaucet', async () => {
		await createFaucet();
		expect(true).to.eql(true, 'createFaucet Did not execute successfully');
	});

	it('✨ createInvoiceWithPrice', async () => {
		await createInvoiceWithPrice();
		expect(true).to.eql(true, 'createInvoiceWithPrice Did not execute successfully');
	});

	// it('recurringPaymentsMembership', async () => {
	// 	await recurringPaymentsMembership();
	// 	expect(true).to.eql(true, 'recurringPaymentsMembership Did not execute successfully');
	// });

	it('recurringPaymentsMeteredAPI', async () => {
		await recurringPaymentsMeteredAPI();
		expect(true).to.eql(
			true,
			'recurringPaymentsMeteredAPI Did not execute successfully'
		);
	});
});
