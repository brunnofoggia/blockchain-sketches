const Contract = artifacts.require("Timelock");

module.exports = function (deployer) {
	deployer.deploy(Contract, web3.utils.toBN(1), ['0xf4a6665ab49f340d8cf45f6a639f43cc63ccb454', '0xb4d43b99e4371b4470ad6c3d6857b10cb1e41309'], []);
};
