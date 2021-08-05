const swc104 = artifacts.require("swc104");

module.exports = function (deployer) {
  deployer.deploy(swc104)
  test = swc104.deployed()
};


//swc104.deployed().then(function(instance){test=instance})
//test.a({value: web3.utils.toWei("1","ether")})
