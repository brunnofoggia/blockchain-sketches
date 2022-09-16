const { expectRevert, expectEvent } = require("@openzeppelin/test-helpers");
const Contract = artifacts.require("Timelock.sol");
const address0 = '0x0000000000000000000000000000000000000000';

contract("Token", (accounts) => {
	let contract;
	// const initialBalance = web3.utils.toBN(web3.utils.toWei("1"));

	before(async () => {
		contract = await Contract.new();
	});
});
