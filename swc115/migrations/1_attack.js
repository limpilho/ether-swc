const swc115 = artifacts.require("swc115");
const attack = artifacts.require("attack");

module.exports = function (deployer) {
  deployer.deploy(swc115);
  deployer.deploy(attack);
};
