const { expectRevert, expectEvent } = require("@openzeppelin/test-helpers");
const Token = artifacts.require("Token.sol");
const address0 = '0x0000000000000000000000000000000000000000';

contract("Token", (accounts) => {
    let token;
    const initialTokens = web3.utils.toWei("0", "ether");
    const defaultBadge = 1;
    const amount = 1;
    const uri = "ipfs://singleuri/";
    var currentBalance = web3.utils.toBN(initialTokens);
    // const initialBalance = web3.utils.toBN(web3.utils.toWei("1"));

    before(async () => {
        token = await Token.new(uri);
    });

    it("should return the total supply", async () => {
        const supply = await token.totalSupply(defaultBadge);
        assert(supply.eq(web3.utils.toBN(initialTokens)));
    });

    it("should mint 1 token of id 1", async () => {
        var receipt = await token.mint(accounts[0], defaultBadge, amount, []);
        const supply = await token.totalSupply(defaultBadge);

        const tokenBalance = web3.utils.toBN(amount);
        assert(supply.eq(tokenBalance));
        expectEvent(receipt, "TransferSingle", {
            // IERC20.Transfer
            operator: accounts[0],
            from: address0,
            to: accounts[0],
            id: web3.utils.toBN(defaultBadge),
            value: web3.utils.toBN(amount),
        });
    });

    it("should mint 1 token of id 2", async () => {
        const badge = 2;
        var receipt = await token.mint(accounts[0], badge, amount, []);
        const supply = await token.totalSupply(badge);

        const tokenBalance = web3.utils.toBN(amount);
        assert(supply.eq(tokenBalance));
        expectEvent(receipt, "TransferSingle", {
            // IERC20.Transfer
            operator: accounts[0],
            from: address0,
            to: accounts[0],
            id: web3.utils.toBN(badge),
            value: web3.utils.toBN(amount),
        });
    });

    it("should mint 1 token of id 2 to another acc", async () => {
        const badge = 2;
        var receipt = await token.mint(accounts[2], badge, amount, []);
        const supply = await token.totalSupply(badge);

        const tokenBalance = web3.utils.toBN(amount);
        expectEvent(receipt, "TransferSingle", {
            // IERC20.Transfer
            operator: accounts[0],
            from: address0,
            to: accounts[2],
            id: web3.utils.toBN(badge),
            value: web3.utils.toBN(amount),
        });
    });

    it("check supplies", async () => {
        var supply = 0, supplies = 0;

        supplies += amount;
        supply = await token.totalSupply(defaultBadge);
        assert(supply.eq(web3.utils.toBN(amount)));

        const badge = 2;
        supplies += amount * 2;
        supply = await token.totalSupply(badge);
        assert(supply.eq(web3.utils.toBN(amount * 2)));

        // all supplies
        supply = await token.totalSupplies();
        assert(supply.eq(web3.utils.toBN(supplies)));
    });

    it("should not mint tokens", async () => {
        await expectRevert(
            token.mint(accounts[0], defaultBadge, amount, [], { from: accounts[2] }),
            "AccessControl: account"
        );
    });

    it("should return the correct balance", async () => {
        var balance = 0;
        balance = await token.balanceOf(accounts[0], defaultBadge);
        assert(balance.eq(web3.utils.toBN(amount)));

        const badge = 2;
        balance = await token.balanceOf(accounts[0], badge);
        assert(balance.eq(web3.utils.toBN(amount)));
        balance = await token.balanceOf(accounts[2], badge);
        assert(balance.eq(web3.utils.toBN(amount)));
    });

    it("check uri's", async () => {
        var _uri = '';
        _uri = await token.tokenURI(defaultBadge);
        assert(_uri.startsWith(uri));

        // const badge = 2;
        // balance = await token.balanceOf(accounts[0], badge);
        // assert(balance.eq(web3.utils.toBN(amount)));
        // balance = await token.balanceOf(accounts[2], badge);
        // assert(balance.eq(web3.utils.toBN(amount)));
    });
});
