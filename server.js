var msgQueue = [function(){console.log("Hellow World~!!")}];
var netMaster = require('net');
var netForServer = require('net');

/*DB설정*/
var Mongolian = require("mongolian");
var dbServer = new Mongolian; //TODO config 로 설정
var db = dbServer.db("pcc");
var lnc = db.collection("lnc");

var processTimeoutInterval = 400;
var slaveTimeout = 300; //슬레이브 기다려주는 시간 더 걸리면 짤없음 하드웨어 랑합의 봄
var delay = 100;        //나머지 처리 시간을 감안해서 준다 (일종의 보정치)

var Queue = [];

//발사.
cl("1. Fire!");

setDefaultQueue(function(){
    processQueue();
});


function setDefaultQueue(callback){
    cl("========================== setDefaultQueue ===========================");
    getLNCList(function(LNC){

        for(var i=0;i<LNC.length;i++){

            Queue.unshift(
                {
                    'procType' : "slaveScan"
                    ,'proc' : function(callback2){

                        var lncId = LNC.pop();

                        var socket = netMaster.createConnection(2000); //var socket = net.createConnection(4001,"192.168.0.223");

                        socket.setTimeout(slaveTimeout ,function(){
                            socket.end();
                            socket.destroy();
                        });
                        socket.on("error",function(err){
                            socket.end();
                            socket.destroy();
                        });
                        
                        socket.on("connect",function(data){
                           /*commenMode 전문 날리기*/
                           //TODO 전문 정리하기
                           var data = [0x10,0x02,lncId,0x00,0x1C,0x54,0x00,0x01,0x0F,0x57];

                           var buf1 = new Buffer(data);

                           socket.write( buf1,function(){
                               cl("---------------------- 1. 보내고 ----------------------");
                               cl(buf1);
                           });

                           socket.on("data",function(data){
                               cl(data);
                               cl("---------------------- 2. 받고 ----------------------");
                               callback2(data);
                               socket.end();
                               socket.destroy();

                           });

                        });
                    }
                    ,'timeoutInterval' : processTimeoutInterval
                }
            );

        }
        callback();
    });
}


var x = null;

//무한루프.
function processQueue(){



    //큐에 있으면 일단 지운다.
    var _obj=null;
    _obj = Queue.pop();
    if(_obj){
        cl("발사.");
        switch(_obj.procType){
            case "slaveScan" :
                _obj.proc(function(data){
                    var buf = new Buffer(data);
                    cl("======================slaveScan=================lnc : "+buf[2]);

                    //전광판 변경
                    fncSignPanel(data, function() {});
                    //전체 상태 업데이트 DB or Memory
                    fncUpdateStatus(data, function() {});
                    //모니터링 쪽으로 전송
                    fncSendToPMS(data, function() {});

                });
            break;

            case "webPush" :
                _obj.proc(function(res,param){
                    cl("======================webPush=================== : "+param.cmd + "[" + param.data + "]");
                    res.writeHead(200, {'Content-Type': 'text/plain'});
                    res.end("<b>"+param.cmd + "[" + param.data + "]");

                })
            break;

            default :
                cl("Proc 형태를 알수가 없습니다.");
            break;
        }

       x = setTimeout(function(){processQueue();},_obj.timeoutInterval + 1);
       //cl(typeof(_obj.timeoutInterval));
    }
    else
    {
        cl("큐가비었네요.");
        setDefaultQueue(function(){
           x = setTimeout(function(){processQueue();},1000);
        });
    }

};

/*
복잡다단한전광판로직..
 */
function fncSignPanel(data, callback){
  cl("fncSignPanel");
};
/*
update db status
 */
function fncUpdateStatus(data, callback){
    cl("fncUpdateStatus");
};

/*
send to pms
 */
function fncSendToPMS(data, callback){
    cl("fncSendToPMS");
};



function getLNCList(callback){
    cl("getLNCList()");

    var lncList = [];

    lnc.find({}).sort({ lncID : 1 }).toArray(function(err,array){
        array.forEach(function(dt){
            lncList.unshift(dt.lncID);
        });
        cl(lncList.length + "개 준다");
        callback(lncList);
    })

};

/*
        web pusher
         //사용법 http://localhost:1337/?cmd=1234&data=hiall
 */

var httpFromPMS = require('http');
httpFromPMS.createServer(function (req, res) {

    var obj = require('url').parse(req.url, true);

    cl("push to Queue ==========================================================> cmd="+obj.query.cmd + "&data=" + obj.query.data);
    Queue.unshift(
        {
            'procType':'webPush'
            ,'proc' : function(callback){
                callback(res,obj.query);
            }
            ,'timeoutInterval' : 1000
        }
    );

}).listen(1337, "127.0.0.1");
cl('Server running at http://127.0.0.1:1337/');



function cl(str){
    console.log("##"+(new Date())+"##"+str);
}