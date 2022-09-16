require("dotenv").config();
const HDWalletProvider = require("@truffle/hdwallet-provider");

module.exports = {
	plugins: ["truffle-plugin-verify"],
	networks: {
		development: {
			host: "127.0.0.1",
			port: 7545,
			network_id: "*",
		},
		ropsten: {
			provider: () =>
				new HDWalletProvider(
					["0x" + process.env.PRIVATE_KEY_ROPSTEN],
					`https://ropsten.infura.io/v3/${process.env.INFURA_KEY}`
				),
			network_id: 3,
			gas: 5500000,
			confirmations: 2,
			timeoutBlocks: 200,
			skipDryRun: true,
		},
		rinkeby: {
			provider: () =>
				new HDWalletProvider(
					["0x" + process.env.PRIVATE_KEY_RINKEBY],
					`https://rinkeby.infura.io/v3/${process.env.INFURA_KEY}`
				),
			network_id: 4,
			gas: 5500000,
			confirmations: 2,
			timeoutBlocks: 200,
			skipDryRun: true,
		},
	},

	// Set default mocha options here, use special reporters etc.
	mocha: {
		// timeout: 100000
	},

	// Configure your compilers
	compilers: {
		solc: {
			version: "0.8.11", // Fetch exact version from solc-bin (default: truffle's version)
			optimizer: {
				enabled: false,
			},
		},
	},
	api_keys: {
		etherscan: process.env.ETHERSCAN_PRIVATE_KEY,
	},
};
