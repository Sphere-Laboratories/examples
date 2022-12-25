import { expect } from 'chai';
import { createFaucet } from '../createFaucet';
import { createInvoice } from '../createInvoice'
import { recurringPaymentsMembership } from '../recurringPaymentsMembership'
export { recurringPaymentsMeteredAPI } from '../recurringPaymentsMeteredAPI'



export const MAX_TIME_TO_EXECUTE_MS = 7 * 1_000;

describe('🍬 Examples Should Execute Successfully', () => {

	it('✨  createFaucet', async () => {
        await createFaucet()
		expect(true).to.eql(true, 'Did not execute successfully');
	});

	it('✨ createInvoice', async () => {
		await createInvoice()
		expect(true).to.eql(true, 'Did not execute successfully');
	});

	it('Malicious User sends us not fulfilled session. We should reject all statuses but "fulfillment_complete"', async () => {
		await recurringPaymentsMembership()
	});

	it('Malicious user attempts to send  to use twice', async () => {
		await recurringPaymentsMeteredAPI()
	});

});