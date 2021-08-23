# *Title*

*swc104 url : [https://swcregistry.io/docs/SWC-104#unchecked-return-valuesol](https://swcregistry.io/docs/SWC-104#unchecked-return-valuesol)*

> *Unchecked Call Return Value*

`call`함수를 사용했을 때, 반환되는 `return` 값을 확인이 없거나 예외처리가 수행되지 않았을 때  발생하는 취약점

- 반환 값을 확인하지 않는 경우, 함수의 호출이 성공했는지, 실패했는지 알 수 없음
- Contract를 호출했을 때, 예외가 발생해도 처리하지 않고 프로그램 실행이 진행됨, 이후 프로그램 진행 과정에서 예기치 않은 동작이 발생할 수 있음

> *Fix*

- low-level 함수를 사용할 때는, 함수 호출이 실패할 경우 `require`(예외처리)를 하거나 `return` 값을 선언하여 반환 값을 확인하도록 함

    → 함수의 호출이 `true`, `false`인지 파악하기 위해서 `return`을 사용

### **실습환경**

- *Truffle v5.4.1 (core: 5.4.1)*
- *Solidity - 0.4.24 (solc-js)*
- *Node v14.17.3*
- *Web3.js v1.4.0*
- *Ganache GUI*

---

# *SWC104 - Code*

### *Vulnerability Contract*

- 취약한 함수 및 수정된 함수가 같이 작성되어 있음

    → 취약하지 않은 함수는 `require` 라는 예외 처리가 선언된 함수

```jsx
pragma solidity 0.4.25;

contract ReturnValue {

  function callchecked(address callee) public {
    require(callee.call());
  }

  function callnotchecked(address callee) public {
    callee.call();
  }
}
```

# *Analysis Process*

## *swc104*

- 해당 코드에 *call( )* 함수가 존재

> *call function*

- call함수 호출 시, 트랜잭션이 발생하지 않으며, 가스를 소모하지 않음

    → 가스가 소모되는지는 파악 필요

- 성공 조건, 데이터를 반환함 (`***True, False***`)

    →  `Return`을 선언해줘야 함수 호출이 정상적으로 진행되었는지 파악 가능 : `***true, false***`

- call함수에 옵션 붙여서 사용할 수 있음

    → 확실하지는 않은데, 직접 사용해봐야 알 것같음

    → `call`에 옵션 설정했더니 값이 가고, 트랜잭션 및 블록이 생성되었음

    - 해당 내용은 ***`Truffle cli`*** 에서 진행된 내용
- ~~다음 코드는 `js`파일에서 사용되는 것 같은데... 코드를 작성하고 하지 않아서, 확실하지 않음~~

```bash
~~address(nameReg).call{gas: 1000000}(abi.encodeWithSignature("register(string)", "MyName"));
address(nameReg).call{value: 1 ether}(abi.encodeWithSignature("register(string)", "MyName"));~~
```

- 성공 조건과, Return 값으로 `bool`을 반환, return은 따로 선언해줘야 함

    → 반환되는 값을 확인하기 위해서 return을 사용, 굳이 안해도 됨

    → `true`, `false`로 반환 됨

---

### 1. swc104.sol

- smart contract 코드 분석
- 함수에 `require`, `return`을 추가하여, 어떤 값을 출력하고 반환하는지 확인
- 4개의 함수로 구성하였음
    - `***function callchecked(address callee)***` : `require`를 선언해 호출 실패 시, 예외처리를 수행
    - ***`function callchecked_return(address callee)`: `return` 을 추가하여, 어떤 값이 반환되는지 확인***

```jsx
// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;
//pragma solidity 0.4.25;

contract swc104 {
    //address x = 0x76E79EdD30799c5B56F4c90D8ce6df8599d3D0e3;
    address callee = msg.sender;

		//require로, 함수 호출에 실패할 경우 예외를 발생시켜 에러를 반환시키고 프로그램을 종료시킴
    function callchecked(address callee) public{ 
        require(callee.call(), "callee.call Fail - Not Return");
    }

		//위와 동일하나, 호출한 함수의 상태를 return으로 확인
    function callchecked_return(address callee) public returns(bool) { 
        require(callee.call(), "callee.call Fail - Use Return");
        return callee.call();
    }

		//함수 호출에 실패하여, 예외가 발생해도 반환 값이나 예외 처리가 없어 에러가 발생했는지 알 수 없음
    function callnotchecked(address callee) public { 
        callee.call();
        
    }

		//callnotchecked 함수와 동일, return을 추가해 반환되는 값을 확인
    function callnotchecked_return(address callee) public returns(bool){
        callee.call();
        return callee.call();
    }

/*
     function a() payable{
         //this.balance가 정상작동 하는지 파악하기 위해서 해당 값을 추가
         //컨트랙트에 이더를 전송하고 출력되는지 파악
     }
*/
}
```

### 2. 2_swc104_migrate.js

- 특이한 점 없음

```jsx
const swc104 = artifacts.require("swc104");

module.exports = function (deployer) {
  deployer.deploy(swc104)
  test = swc104.deployed()
};

//swc104.deployed().then(function(instance){test=instance})
//test.a({value: web3.utils.toWei("1","ether")})
```

### 3. swc104_test.js

- 각 함수에 정상적인 Contract를 입력했을 때와, 외부 Contract를 입력했을 때 출력되는 값과 상태를 확인하기 위함
- ***`callchecked`함수는 `require`가 선언되어 있기 때문에 호출 실패 시, 예외처리가 되어 프로그램이 안전하게 종료됨***
- *`**callnotchecked` 함수는 입력된 함수만 호출하기 때문에, 호출에 실패했는지, 성공했는지 파악할 수 없음, 이로 인해 이후 프로그램에서 문제가 발생할 수 있음***
    - 예외처리가 되지 않으면, 함수의 호출이 실패되어도 다음 코드를 실행하기 때문에 예상하지 못한 동작이 발생할 수 있음

        **→ 제대로 확인하지 못한 것이기 때문에, 다른 함수나, 코드가 실행되는지 파악하는 것이 필요**

```jsx
const Web3 = require('web3');
const web3 = new Web3(new Web3.providers.HttpProvider("http://127.0.0.1:9545"));
const test_json = require("../build/contracts/swc104.json");
const getabi = test_json['abi'];

/////////////////////////////////Call function check/////////////////////////////////
async function callchecked_run(){
    const comp = new web3.eth.Contract(getabi, "0x6Ae44Ba3fd3aF3b1246Ed43D804e49d963381315");//contract addr
    //contract내의 계약 주소를 호출, 같은 컨트랙트 내에 있기 때문에, 해당 계약 주소를 호출할 수 있음
    await comp.methods.callchecked("0x1Ea2931b1cEFfB5d3426462983F5E8F0a672C5BD").call().then(
        function(result){
            console.log("                                                            ")
            console.log("                                                            ")
            console.log("function call fail = false, function call sccuess = true")
            console.log("::::::::::::::::::Function callchecked_return_run::::::::::::::::::")
            console.log("::::::::::::if, Returned Error => functions call fail::::::::::::")
            console.log("callchecked_run :",result);
        }
    );
}
async function callchecked_return_run(){
    const comp = new web3.eth.Contract(getabi, "0x6Ae44Ba3fd3aF3b1246Ed43D804e49d963381315");//contract addr
    //contract내의 계약 주소를 호출, 같은 컨트랙트 내에 있기 때문에, 해당 계약 주소를 호출할 수 있음
    await comp.methods.callchecked_return("0x1Ea2931b1cEFfB5d3426462983F5E8F0a672C5BD").call().then(
        function(result1){
            console.log("                                                            ")
            console.log("                                                            ")
            console.log("function call fail = false, function call sccuess = true")
            console.log("::::::::::::::::::Function callchecked_return_run::::::::::::::::::")
            console.log("::::::::::::if, Returned Error => functions call fail::::::::::::")
            console.log("callchecked__return_run :",result1);
        }
    );
}

/////////////////////////////////Call function Not check/////////////////////////////////
async function callnotchecked_run(){
    const comp = new web3.eth.Contract(getabi, "0x6Ae44Ba3fd3aF3b1246Ed43D804e49d963381315"); //contract addr
    await comp.methods.callnotchecked("0x1Ea2931b1cEFfB5d3426462983F5E8F0a672C5BD").call().then(
        function(result2){
            console.log("                                                            ")
            console.log("                                                            ")
            console.log("function call fail = false, function call sccuess = true")
            console.log("::::::::::::::::::Function callnotchecked_run::::::::::::::::::")
            console.log("::::::::::::if, Returned Error => functions call fail::::::::::::")
            console.log("callnotchecked_run :",result2);
        }
    );
}    
async function callnotchecked_return_run(){
    const comp = new web3.eth.Contract(getabi, "0x6Ae44Ba3fd3aF3b1246Ed43D804e49d963381315"); //contract addr
    await comp.methods.callnotchecked_return("0x1Ea2931b1cEFfB5d3426462983F5E8F0a672C5BD").call().then(
        function(result3){
            console.log("                                                            ")
            console.log("                                                            ")
            console.log("function call fail = false, function call sccuess = true")
            console.log("::::::::::::::::::Function callnotchecked_return_run::::::::::::::::::")
            console.log("::::::::::::if, Returned Error => functions call fail::::::::::::")
            console.log("callnotchecked_return_run :",result3);
        }
    );
}    

callchecked_run();
callchecked_return_run();
callnotchecked_run();
callnotchecked_return_run();
```

- swc104_test.js

테스트 코드를 이용해서, 각 함수를 호출하고 `return`, `require` 를 통한 반환 값 및 예외처리 내용 확인가능

- 호출되는 주소 값은, 현재 컨트랙트가 갖고 있는 계정의 주소 값이며, 그 외의 값을 호출할 경우 예외처리가 발생함

> 정상적인 Contract를 호출했을 때, 발생 결과

- `return`이 선언되지 않은 함수들은 아무런 값을 반환하지 않음
- `return`이 선언된 함수는 반환 값으로 `true`를 선언함, Contract를 정상적으로 호출한 것을 의미

```jsx
C:\~\swc104\test>node test.js 

function call fail = false, function call sccuess = true
::::::::::::::::::Function callchecked_run::::::::::::::::::
::::::::::::if, Returned Error => functions call fail::::::::::::
callchecked_run : Result {}

function call fail = false, function call sccuess = true
::::::::::::::::::Function callchecked_return_run::::::::::::::::::
::::::::::::if, Returned Error => functions call fail::::::::::::
callchecked__return_run : true

function call fail = false, function call sccuess = true
::::::::::::::::::Function callnotchecked_run::::::::::::::::::
::::::::::::if, Returned Error => functions call fail::::::::::::
callnotchecked_run : Result {}

function call fail = false, function call sccuess = true
::::::::::::::::::Function callnotchecked_return_run::::::::::::::::::
::::::::::::if, Returned Error => functions call fail::::::::::::
callnotchecked_return_run : true
```

> 외부 Contract를 호출했을 때, 발생 결과

- `require`가 선언된 함수는 예외처리가 발생하며, 에러를 출력함
    - `return`을 선언한 함수의 경우에도, 함수 호출이 실패 했기 때문에 `return` 값을 반환하지 못함
- `require`가 선언되지 않은 함수는 결과 값 및 반환 값을 알 수 없으며, 프로그램에 문제가 발생해도 알 수 없음
    - `return`을 선언한 함수는 `false`를 반환한 것을 확인 → 함수의 호출이 실패한 것을 의미

```jsx
//require가 선언된 함수
Error: Returned error: VM Exception while processing transaction: 
revert callee.call Fail - Not Return

//require와 return이 선언된 함수
Error: Returned error: VM Exception while processing transaction: 
revert callee.call Fail - Use Return

//require가 선언되지 않은 취약한 함수
function call fail = false, function call sccuess = true
::::::::::::::::::Function callnotchecked_run::::::::::::::::::
::::::::::::if, Returned Error => functions call fail::::::::::::
callnotchecked_run : Result {}

//require가 선언되지 않았으나, Return은 선언하여 반환 값을 확인할 수 있음
function call fail = false, function call sccuess = true
::::::::::::::::::Function callnotchecked_return_run::::::::::::::::::
::::::::::::if, Returned Error => functions call fail::::::::::::
callnotchecked_return_run : false
```

---

## *Full Process*

1. Smart Contract 생성

- swc104.sol, 1_swc104_migrate.js, swc104_test.js
    - 3개의 구성파일 준비

2. migrate

- 스마트 컨트랙트를 Test 네트워크에 배포

3. swc104_test.js를 통한 테스트 진행

- 각 함수가 정상적인 계약 주소를 호출했을 때, 비정상적 계약 주소를 호출 했을 때에 대한 반환 값 확인

> 함수 호출 성공

- `***Require***`을 선언하지 않은 경우 : 아무런 값도 출력되지 않음
- `***Require***`을 선언한 경우 : 아무런 값도 출력되지 않음
- `***Return***`을 선언한 경우 : `***true***`를 반환

> 함수 호출 실패

- `***Require***`을 선언하지 않은 경우 = 아무런 값도 출력되지 않음
- `***Require***`을 선언한 경우 = 예외가 발생하며, 작성한 에러 메시지를 출력
    - Error Mesage : `***callee.call Fail - Not Return***`
- `***Return***`을 선언한 경우 : `***false***`를 반환

---

## *conclusion*

- low-level 수준의 함수를 사용할 때는 `***Require***`, `***Return***`를 선언하여, 반환되는 값 확인 및 예외처리가 필요
    - low-level function : *`**call()**`*, ***`delegatecall()`***, `***send()***`
- 예외처리가 없는 경우, 함수 호출이 실패할 경우 컨트랙트 실행에 문제가 발생할 수 있음
