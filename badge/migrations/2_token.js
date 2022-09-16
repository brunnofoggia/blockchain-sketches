require("dotenv").config();
const Contract = artifacts.require("Token");

const baseURI = 'ipfs://' + process.env.IPFS_JSON_KEY + '/';
module.exports = function (deployer) {
	deployer.deploy(Contract, baseURI);
};
