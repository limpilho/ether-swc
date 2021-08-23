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
    _; //require 조건이 만족되면, 함수를 실행시킨다는 의미
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

  //함수명이 컨트랙트명과 동일하지 않아, 일반 호출 함수가 됨 - 취약코드
  /*function Swc118() public{
    owner = msg.sender;
    emit setowner_event(owner, msg.sender);
  } */

  //생성자 fixed, 생성자를 사용해 owner를 고정
  /*constructor() public {
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

//외부에서 호출하려고 했으나, onlyowner가 컨트랙트로 되어버려서 ...msg.sender와 달라져버림
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