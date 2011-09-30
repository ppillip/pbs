var msgQueue = [function(){console.log("Hellow World~!!")}];
var netMaster = require('net');
var netForServer = require('net');
var slaveTimeout = 100; //슬레이브 기다려주는 시간 더 걸리면 짤없음
var delay = 100; //나머지 처리 시간을 감안해서 준다
var lncScanTimeout = (getLNCList().length * (slaveTimeout+delay)) + 2500;//전체 lnc를 한번 스켄할때 들어 가는 시간을 계산한다

var x = setInterval(function(){
    if(msgQueue.length){
        try{
            (msgQueue.pop())();
        }catch(err){
            console.log(err.message);
        }
    }else{
        fncCommon(getLNCList());
    }
},lncScanTimeout);

//이것은 텔넷 테스트용
var server = netForServer.createServer(function (socket) {
    socket.on("data",function(data){
       console.log("---------------------"+data+"-------------------------");
       msgQueue.unshift(function(){console.log("["+data+"]")});
    })
});
server.listen(2003, "127.0.0.1");

//사용법 http://localhost:1337/?cmd=1234&data=hiall
var httpFromPMS = require('http');
httpFromPMS.createServer(function (req, res) {
  var obj = require('url').parse(req.url, true);

  fncCmdFromPMS(obj.query,function(data){
      res.writeHead(200, {'Content-Type': 'text/plain'});
      res.end(data);
  });
}).listen(1337, "127.0.0.1");
console.log('Server running at http://127.0.0.1:1337/');


function fncCmdFromPMS(param,callback){
    //TODO 커맨드 처리해서 메세지 큐에 뻥션 넣자;
    console.log("---------------------"+param.cmd+":"+param.data+"-------------------------");

    msgQueue.unshift(function(){console.log("["+param.cmd+":"+param.data+"]")});

    callback("COMMAND STRING:["+param.cmd +"]<br>DATA:["+ param.data+"] excuted successfuly");

};

function fncCommon(LNC){
    var interval = setInterval(function() {
            var lncid;
            if (lncid = LNC.pop()) {

                console.log(lncid);

                fncRequestToSlave(lncid, function(status, data) {

                    if (status) {
                        //전광판 변경
                        fncSignPanel(data, function() {});
                        //전체 상태 업데이트 DB or Memory
                        fncUpdateStatus(data, function() {});
                        //모니터링 쪽으로 전송
                        fncSendToPMS(data, function() {});
                    } else {
                        console.log(data);
                    }

                });

            } else {
                clearInterval(interval);
            }
        }
    ,slaveTimeout+delay);

}

function getLNCList(){
    var lncList = [];

    //TODO lnc목록을 디비에서 가져 온다
    lncList = [1,2,3,4,5];

    return lncList;
}

function fncRequestToSlave (lncId,callback){
   var socket = netMaster.createConnection(2000); //var socket = net.createConnection(4001,"192.168.0.223");

   socket.setTimeout(slaveTimeout,function(){
       callback(false,"Request timeout from Slave.");
       socket.end();
       socket.destroy();
   });

   socket.on("error",function(err){
       socket.end();
       socket.destroy();
       callback(false,err.message);
   });

   socket.on("connect",function(data){
       /*commenMode 전문 날리기*/
       //TODO 전문 정리하기
       var data = [0x10,0x02,lncId,0x00,0x1C,0x54,0x00,0x01,0x0F,0x57];

       var buf1 = new Buffer(data);

       socket.write( buf1,function(){
           console.log("---------------------- Write ----------------------");
           console.log(buf1);
       });

       socket.on("data",function(data){
           console.log(data);
           console.log("---------------------- Read ----------------------");
           socket.end();
           socket.destroy();
           callback(true,data);


       });
   });
}

function fncSignPanel(msg,callback){
    //TODO : 전광판제어
    callback();
}

 function fncUpdateStatus(msg,callback){
    //TODO : 상태 업데이트
    callback();
}

function fncSendToPMS(msg,callback){
    //TODO : PMS 쪽으로 데이터 전송
    callback();
}
