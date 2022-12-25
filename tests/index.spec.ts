import { expect } from 'chai';
import { createFaucet } from '../createFaucet';
import { createInvoice } from '../createInvoice';
import { recurringPaymentsMembership } from '../recurringPaymentsMembership';
import { recurringPaymentsMeteredAPI } from '../recurringPaymentsMeteredAPI';

export const MAX_TIME_TO_EXECUTE_MS = 7 * 1_000;

describe('🍬 Examples Should Execute Successfully', () => {
	it('✨  createFaucet', async () => {
		await createFaucet();
		expect(true).to.eql(true, 'createFaucet Did not execute successfully');
	});

	it('✨ createInvoice', async () => {
		await createInvoice();
		expect(true).to.eql(true, 'createInvoice Did not execute successfully');
	});

	// it('recurringPaymentsMembership', async () => {
	// 	await recurringPaymentsMembership();
	// 	expect(true).to.eql(true, 'recurringPaymentsMembership Did not execute successfully');
	// });

	it('recurringPaymentsMeteredAPI', async () => {
		await recurringPaymentsMeteredAPI();
		expect(true).to.eql(true, 'recurringPaymentsMeteredAPI Did not execute successfully');
	});
});
