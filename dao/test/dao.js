const { expectRevert, expectEvent } = require("@openzeppelin/test-helpers");
const Dao = artifacts.require("Dao.sol");
const address0 = '0x0000000000000000000000000000000000000000';
const zeroBN = web3.utils.toBN(0);

var provider = new web3.providers.HttpProvider("http://localhost:9545");
const smartContract = require('@truffle/contract');
const TokenArtifact = require('./../../token/build/contracts/Token.json');
try {
	var Token = smartContract({ abi: TokenArtifact.abi });
	Token.setProvider(provider);
} catch (e) {
}

contract("Dao", (accounts) => {
	let dao;
	let token;

	before(async () => {
		// dao = await Dao.new('0xDE57b60e36f3C50581cB80B8F7Fd0D535A2cbD8b', '0x807AacB175E62c349Dfa9520606f53284CdC9668');
		dao = await Dao.new('0x8C08C810A50f2eb958CE1Dc774E117E28e9C5cf5', '0x91a9c212092B43f93B721Fc85084D0593BF3CcAa');
		try {
			token = await Token.at('0x8C08C810A50f2eb958CE1Dc774E117E28e9C5cf5');
		} catch (e) {
			console.log('nao instanciou', e);
		}
	});

	// it("bignumber test", async () => {
	// 	try {
	// 		console.log(`bignumber`);
	// 		console.log(web3.utils.toBN(0));
	// 		console.log(web3.utils.toBN(1));
	// 	} catch (e) { }

	// 	assert(true);
	// });

	it("balanceof test", async () => {
		const increment = "100";
		const incrementTokens = web3.utils.toWei(increment, "ether");
		var receipt = await token.mint(accounts[0], increment, { from: accounts[0] });

		expectEvent(receipt, "Transfer", {
			// IERC20.Transfer
			from: address0,
			to: accounts[0],
			value: web3.utils.toBN(incrementTokens),
		});

		const votingPower0 = await dao.getVotes(accounts[0], zeroBN);
		const votingPower1 = await dao.getVotes(accounts[1], zeroBN);

		assert(votingPower0.eq(web3.utils.toBN(1)) && votingPower1.eq(web3.utils.toBN(0)));
		// assert(votingPower0.eq(web3.utils.toBN(initialTokens)));
	});
});
