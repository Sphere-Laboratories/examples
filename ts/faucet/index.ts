import { web3, Faucet } from '@spherelabs/sdk';

(async () => {
	const config: any = {
		env: 'devnet',
		signer: process.env.SOLANA_PRIVATE_KEY || '',
		rpcUrl: process.env.SOLANA_RPC_URL || '',
	};

	// Create a Faucet
	const faucet = new Faucet(config);

	// To airdrop SOL to the signer
	await faucet.airdropSol();

	// Create a new currency (mint), for the faucet.
	await faucet.initialize();

	// The newly 
	const currency: web3.PublicKey = faucet.currency;

	// If a faucet already exists, you may also initialize a faucet from a mint.
	const derivedFaucet: Faucet = Faucet.fromCurrency(
		currency.toString(),
		config
	);

	// Returns the signer as an AnchorWallet or WalletContextState
	const wallet = faucet.getSigner();

	// // Mint 100  tokens to yourself
	await faucet.mintToSelf(100);

	// // Mint 100 tokens to a pubkey
	const receiver: web3.PublicKey = web3.Keypair.generate().publicKey;
	await faucet.mintTo(receiver, 100);

	// Retrieve the currency's decimals
	const decimals: number = faucet.decimals;

	// // Retrieve the faucet signer's token account
	const signerAccountInfo = faucet.signerTokenAccountInfo;

	// // Get or create associated token account info for a pubkey
	const accountInfo = faucet.getOrCreateAssociatedAccountInfo(receiver);
})();
