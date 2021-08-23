const modtest = artifacts.require("modtest");
const caller = artifacts.require("caller");

module.exports = function (deployer) {
  deployer.deploy(modtest);
  deployer.deploy(caller);
};
