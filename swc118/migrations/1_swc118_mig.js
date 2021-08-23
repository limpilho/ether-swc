const swc118 = artifacts.require("swc118");
const attack = artifacts.require("attack");

module.exports = function (deployer) {
  deployer.deploy(swc118);
  deployer.deploy(attack);
};
