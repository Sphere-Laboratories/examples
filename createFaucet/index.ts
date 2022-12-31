import { web3, Sphere, Env } from '@spherelabs/sdk';

export const createFaucet = async () => {
	const sphere = new Sphere({
		env: (process.env.ENV as Env) || 'devnet',
		apiKey: process.env.SPHERE_API_KEY || '',
		signer: process.env.SOLANA_PRIVATE_KEY || '',
		rpcUrl: process.env.SOLANA_RPC_URL || '',
	});

	// To airdrop SOL to the signer
	await sphere.faucet.airdropSol();

	// Create a new currency (mint), for the faucet.
	await sphere.faucet.initialize();

	// The mint address of the newly created currency.
	const currency: web3.PublicKey = sphere.faucet.currency;

	// Returns the signer as an AnchorWallet or WalletContextState
	const signer = sphere.web3.auth();

	// // Mint 100 tokens to yourself
	await sphere.faucet.mintToSelf(100);

	// // Mint 100 tokens to a pubkey
	const receiver: web3.PublicKey = web3.Keypair.generate().publicKey;
	await sphere.faucet.mintTo(receiver, 100);

	// // Retrieve the faucet signer's token account
	const signerAccountInfo = sphere.web3.faucet.signerTokenAccountInfo;

	// // Get or create associated token account info for a pubkey
	const accountInfo =
		sphere.web3.faucet.getOrCreateAssociatedAccountInfo(receiver);
};
