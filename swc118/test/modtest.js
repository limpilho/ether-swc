const Web3 = require('web3');
const web3 = new Web3(new Web3.providers.HttpProvider("http://127.0.0.1:9545"));
const modtest_json = require("../build/contracts/modtest.json")
const caller_json = require("../build/contracts/caller.json")
const modtest_abi = modtest_json['abi'];
const caller_abi = caller_json['abi'];
const _modtest = new web3.eth.Contract(modtest_abi, "0x2Fe35f2448b0BA435F1f65fd036D7BF38f2A63c4");
const _caller = new web3.eth.Contract(caller_abi, "0x9d1857B963cf64269D6428D515C1E8Bed691724e");


async function modtest_(){
    const account0 = (await web3.eth.getAccounts())[0];
    const account1 = (await web3.eth.getAccounts())[1];

    await _caller.methods.func().send({from:account1,gas:100000,gasPrice:'100000'}).then(
        function(result){
            console.log(result);
        }
    )

}

modtest_();