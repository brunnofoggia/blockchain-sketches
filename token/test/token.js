const { expectRevert, expectEvent } = require("@openzeppelin/test-helpers");
const Token = artifacts.require("Token.sol");
const address0 = '0x0000000000000000000000000000000000000000';

contract("Token", (accounts) => {
	let token;
	const initialTokens = web3.utils.toWei("0", "ether");
	var currentBalance = web3.utils.toBN(initialTokens);
	// const initialBalance = web3.utils.toBN(web3.utils.toWei("1"));

	before(async () => {
		token = await Token.new();
	});

	it("should return the total supply", async () => {
		const supply = await token.totalSupply();
		assert(supply.eq(web3.utils.toBN(initialTokens)));
	});

	it("should mint tokens", async () => {
		const increment = "100000001";
		const incrementTokens = web3.utils.toWei(increment, "ether");
		var receipt = await token.mint(accounts[0], increment);
		const supply = await token.totalSupply();

		currentBalance = currentBalance.add(web3.utils.toBN(incrementTokens));
		// assert(supply.eq(currentTokens));
		expectEvent(receipt, "Transfer", {
			// IERC20.Transfer
			from: address0,
			to: accounts[0],
			value: web3.utils.toBN(incrementTokens),
		});
	});

	it("should not mint tokens", async () => {
		await expectRevert(
			token.mint(accounts[0], initialTokens, { from: accounts[2] }),
			"AccessControl: account"
		);
	});

	it("should return the correct balance", async () => {
		const balance = await token.balanceOf(accounts[0]);
		assert(balance.eq(currentBalance));
	});
	
	it("should transfer token", async () => {
		const transfer = web3.utils.toBN(web3.utils.toWei("2", "ether"));
		const receipt = await token.transfer(accounts[1], transfer);
		const balance1 = await token.balanceOf(accounts[0]);

		currentBalance = currentBalance.sub(transfer);
		assert(balance1.eq(currentBalance));
		expectEvent(receipt, "Transfer", {
			// IERC20.Transfer
			from: accounts[0],
			to: accounts[1],
			value: transfer,
		});
	});

	it("should NOT transfer token if balance too low", async () => {
		const transfer = currentBalance.add(web3.utils.toBN(web3.utils.toWei("1", "ether")));
		await expectRevert(
			token.transfer(accounts[1], transfer),
			"transfer amount exceeds balance"
		);
	});

	// burnable
	it("should burn token", async () => {
		const balance1 = await token.balanceOf(accounts[0]);
		const burn = web3.utils.toBN(web3.utils.toWei("1", "ether"));
		const receipt = await token.burn(burn);
		const balance2 = await token.balanceOf(accounts[0]);
		const initialBalance = web3.utils.toBN(initialTokens);

		assert(balance2.eq(balance1.sub(burn)));
		expectEvent(receipt, "Transfer", {
			// IERC20.Transfer
			from: accounts[0],
			value: burn,
		});
	});

	it("should NOT burn token", async () => {
		const burn = web3.utils.toBN(web3.utils.toWei("1", "ether"));
		await expectRevert(
			token.burn(burn, { from: accounts[1] }),
			"AccessControl: account"
		);
	});

	// pausable
	it("should pause and reject transfers", async () => {
		const receipt = await token.pause();

		expectEvent(receipt, "Paused", {
			account: accounts[0],
		});
		await expectRevert(
			token.transfer(accounts[0], web3.utils.toBN(initialTokens)),
			"Pausable: paused"
		);
	});

	it("should unpause and allow transfers", async () => {
		const receipt = await token.unpause();
		const transfer = web3.utils.toBN(web3.utils.toWei("1", "ether"));
		const receiptTransfer = await token.transfer(accounts[1], transfer);

		expectEvent(receipt, "Unpaused", {
			account: accounts[0],
		});
		expectEvent(receiptTransfer, "Transfer", {
			// IERC20.Transfer
			from: accounts[0],
			to: accounts[1],
			value: transfer,
		});
	});

	// roles


	it("grant role admin and burn token", async () => {
		const balance = await token.balanceOf(accounts[1]);

		var adminRoleName = 'DEFAULT_ADMIN_ROLE';
		var adminRole = await token.DEFAULT_ADMIN_ROLE.call();

		const receipt = await token.grantRole(adminRole, accounts[1]);
		expectEvent(receipt, "RoleGranted", {
			role: adminRole,
			account: accounts[1],
			sender: accounts[0],
		});

		// assert(true);
		const burn = web3.utils.toBN(web3.utils.toWei("1", "ether"));
		const burnReceipt = await token.burn(burn, { from: accounts[1] });
		expectEvent(burnReceipt, "Transfer", {
			// IERC20.Transfer
			from: accounts[1],
			value: burn,
		});
	});



	// it("should transfer token when approved", async () => {
	//     let allowance;
	//     let receipt;
	//     const _100 = web3.utils.toBN(100);

	//     allowance = await token.allowance(accounts[0], accounts[1]);
	//     assert(allowance.isZero());

	//     receipt = await token.approve(accounts[1], _100);
	//     allowance = await token.allowance(accounts[0], accounts[1]);
	//     assert(allowance.eq(_100));
	//     expectEvent(receipt, "Approval", {
	//         tokenOwner: accounts[0],
	//         spender: accounts[1],
	//         tokens: _100,
	//     });

	//     receipt = await token.transferFrom(accounts[0], accounts[2], _100, {
	//         from: accounts[1],
	//     });
	//     allowance = await token.allowance(accounts[0], accounts[1]);
	//     const balance1 = await token.balanceOf(accounts[0]);
	//     const balance2 = await token.balanceOf(accounts[2]);
	//     assert(balance1.eq(initialBalance.sub(_100)));
	//     assert(balance2.eq(_100));
	//     assert(allowance.isZero());
	//     expectEvent(receipt, "Transfer", {
	//         from: accounts[0],
	//         to: accounts[2],
	//         tokens: _100,
	//     });
	// });

	// it("should NOT transfer token if not approved", async () => {
	//     await expectRevert(
	//         token.transferFrom(accounts[0], accounts[1], 10),
	//         "allowance too low"
	//     );
	// });
});
