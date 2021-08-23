// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

contract modtest{
    uint public mutex=0;
    uint public exeCnt=0;

    modifier check{
        mutex++;
        _;
        mutex--;
    }

    function getWithCheck() check public{
        if(mutex==1)
            exeCnt=exeCnt+1;
    }
}

contract caller{
    event log(uint data1, uint data2);
    modtest modcontract;
    function func() public {
        //modtest t = new modtest();

        //1번째 함수 호출
        emit log(modcontract.mutex(), modcontract.exeCnt());
        modcontract.getWithCheck();

        //2번째 함수 호출
        /*emit log(t.mutex(), t.exeCnt());
        t.getWithCheck();
        */
        emit log(modcontract.mutex(), modcontract.exeCnt());
        
    }
}