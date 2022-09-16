const Contract = artifacts.require("Dao");

module.exports = function (deployer) {
	deployer.deploy(Contract, '0x2962E2105Dcd0e16B135a6F059Cd5337c9f229F9', '0xFaD7f4127362BbEC12A9B226C657d01603c0654b');
};
