const Contract = artifacts.require("Token");

module.exports = function (deployer) {
	deployer.deploy(Contract);
};
