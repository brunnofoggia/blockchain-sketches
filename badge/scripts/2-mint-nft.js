const Token = artifacts.require('Token');
const NFT = require('../nft.json');

module.exports = async (callback) => {
	const accounts = await web3.eth.getAccounts();
	const token = await Token.deployed()
	console.log('Creating NFTs on contract:', token.address);

	var nftTotal = parseInt((await token.totalSupply()).toString(10), 10);

	// skips NFTs already generated
	for (var i = nftTotal; i < NFT.length; i++) {
		let item = NFT[i];
		console.log('minted nft ', i, item.name, ' to ', accounts[0]);
		await token.safeMint(accounts[0]);
	}

	callback();

}
