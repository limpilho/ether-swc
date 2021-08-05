// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;
//pragma solidity 0.4.25;

contract swc104 {
    //address x = 0x76E79EdD30799c5B56F4c90D8ce6df8599d3D0e3;
    //string greeting = "TEST";
    address callee = msg.sender;
    function callchecked(address callee) public{ //require로, 함수 호출에 실패할 경우 예외를 발생시켜 에러를 반환시키고 프로그램을 종료시킴
        require(callee.call(), "callee.call Fail - Not Return");
    }

    function callchecked_return(address callee) public returns(bool) { //위와 동일하나, 호출한 함수의 상태를 return으로 확인
        require(callee.call(), "callee.call Fail - Use Return");
        return callee.call();
    }

    function callnotchecked(address callee) public { //함수 호출에 실패하여, 예외가 발생해도 반환 값이나 예외 처리가 없어 에러가 발생했는지 알 수 없음
        callee.call();
        
    }
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