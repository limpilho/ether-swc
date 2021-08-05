const Web3 = require('web3');
const web3 = new Web3(new Web3.providers.HttpProvider("http://127.0.0.1:9545"));
const test_json = require("../build/contracts/swc104.json");
//const a = test_json['abi'];
const getabi = test_json['abi'];



/////////////////////////////////Call function check/////////////////////////////////
async function callchecked_run(){
    const comp = new web3.eth.Contract(getabi, "0x6Ae44Ba3fd3aF3b1246Ed43D804e49d963381315");//contract addr
    //const get_acct = await web3.eth.getAccounts();
    //onsole.log(get_acct);
    //contract내의 계약 주소를 호출, 같은 컨트랙트 내에 있기 때문에, 해당 계약 주소를 호출할 수 있음
    await comp.methods.callchecked("0xcCBB2288A4c6bD4c69BBe962898781Ec4EA6ae03").call().then(
        function(result){
            console.log("                                                            ")
            console.log("                                                            ")
            console.log("function call fail = false, function call sccuess = true")
            console.log("::::::::::::::::::Function callchecked_run::::::::::::::::::")
            console.log("::::::::::::if, Returned Error => functions call fail::::::::::::")
            console.log("callchecked_run :",result);
        }
    );
}
async function callchecked_return_run(){
    const comp = new web3.eth.Contract(getabi, "0x6Ae44Ba3fd3aF3b1246Ed43D804e49d963381315");//contract addr
    //const get_acct = await web3.eth.getAccounts();
    //console.log(get_acct);
    //contract내의 계약 주소를 호출, 같은 컨트랙트 내에 있기 때문에, 해당 계약 주소를 호출할 수 있음
    await comp.methods.callchecked_return("0xcCBB2288A4c6bD4c69BBe962898781Ec4EA6ae03").call().then(
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
    //const get_acct = await web3.eth.getAccounts();

    //console.log(get_acct);
    await comp.methods.callnotchecked("0xcCBB2288A4c6bD4c69BBe962898781Ec4EA6ae03").call().then(
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
    //const get_acct = await web3.eth.getAccounts();

    //console.log(get_acct);
    
    await comp.methods.callnotchecked_return("0xcCBB2288A4c6bD4c69BBe962898781Ec4EA6ae03").call().then(
        function(result3){
            console.log("                                                            ")
            console.log("                                                            ")
            console.log("function call fail = false, function call sccuess = true")
            console.log("::::::::::::::::::Function callnotchecked_return_run::::::::::::::::::")
            console.log("::::::::::::if, Returned Error => functions call fail::::::::::::")
            console.log("callnotchecked_return_run :",result3);
        }
    );
    /*await comp.methods.callchecked_return("0xcCBB2288A4c6bD4c69BBe962898781Ec4EA6ae03").send({from: "0x35c9d78FbAB9bC43845C1E2f4303B6A065272996",gas:200000, gasPrice:'200000'}).then(
        function(result2){
            console.log(result2);
        }
    );
    */
    /*    await comp.methods.callnotchecked("0x6Be7eB8Afe99E8083d77b25a503a66080C6B2c2f").call({from: "0xcCBB2288A4c6bD4c69BBe962898781Ec4EA6ae03"}).then(
        function(result){
            console.log(result);
        }
    );*/
        //함수 호출에 성공한 경우 "Result{}" 만 출력되어야 함. => 근데, 호출에 성공한건지 실패한건지 알 수 없음
}    

callchecked_run();
callchecked_return_run();
callnotchecked_run();
callnotchecked_return_run();



//sendcall_run();

    /*await comp.methods.callnotchecked("0xD35E2A135D2c53DC483ab8E5c4547fB7406b3E0d").send({from:"0x35c9d78FbAB9bC43845C1E2f4303B6A065272996",gas:150000, gasPrice:"150000"}).then(
        function(result){
            console.log(result);
        }
    );*/

/*    await comp.methods.callnotchecked("0x6Be7eB8Afe99E8083d77b25a503a66080C6B2c2f").call({from: "0xcCBB2288A4c6bD4c69BBe962898781Ec4EA6ae03"}).then(
        function(result){
            console.log(result);
        }
    );*/
        //함수 호출에 성공한 경우 "Result{}" 만 출력되어야 함. => 근데, 호출에 성공한건지 실패한건지 알 수 없음

/*
async function sendcall_run(){s
    const comp = new web3.eth.Contract(getabi, "0x15C58Dba5de64Bc4Ed022aa785b4928DB2D594e3");
    const get_acct = await web3.eth.getAccounts();

    console.log(get_acct);

    console.log("::::::::::::::::::Function call_not_checked run::::::::::::::::::")
    console.log("::::::::::::if, Returned Error => functions call fail::::::::::::")
    
    /*await comp.methods.sendcall("0x15C58Dba5de64Bc4Ed022aa785b4928DB2D594e3").call().then(
        function(result){
            console.log(result);
        }
    );
    await comp.methods.sendcall("0x35c9d78FbAB9bC43845C1E2f4303B6A065272996").send({from: "",gas:50000, gasPrice:"150000"}).then(
        function(result){
            console.log(result);
        } 
    );
*/
//{from:"0x35c9d78FbAB9bC43845C1E2f4303B6A065272996",to:"0x6Ae44Ba3fd3aF3b1246Ed43D804e49d963381315", value:'1000000000000'}
//from, to를 지정했을 때, 정상ㅈ ㅓㄱ인 값으로 인식하지만, 트랜잭션이 발생하지는 않음 call이기 때문에