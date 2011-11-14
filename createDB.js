/*DB설정*/
var mongolian = require("mongolian");
var mongoServer = new mongolian("localhost:27017");
var db = mongoServer.db("pcc");
var pcc = db.collection("pcc");


console.log("start")

//////////////////////////////////////////////////////////////////////////////////////////////
var data = [
/*pccConfig*/
{
    documentType : "pccConfig"
    ,longTermUse : "Y"
    ,longTermUnit : "H"
    ,longTermVal : "24"
}

/*user*/
    ,{
         documentType:"user"
        ,userID 	: "admin"
        ,userPassword 	: "1234"
        ,userType :"0" /*관리자*/
    }
    ,{
         documentType:"user"
        ,userID 	: "ppillip"
        ,userPassword 	: "1234"
        ,userType :"1" /*일반사용자*/
    }

/*floor*/
    ,{
         documentType :"floor"
        ,floorID     :"1"
        ,floorName   :"지하1층"
        ,floorOrder  :"1"
        ,availableCnt:"100"
        ,currentCnt  :"30"
        ,reserveCnt  :"30"
    }
    ,{
         documentType :"floor"
        ,floorID     :"2"
        ,floorName   :"1층"
        ,floorOrder  :"2"
        ,availableCnt:"100"
        ,currentCnt  :"0"
        ,reserveCnt  :"30"
    }
    ,{
         documentType :"floor"
        ,floorID     :"3"
        ,floorName   :"2층"
        ,floorOrder  :"3"
        ,availableCnt:"100"
        ,currentCnt  :"5"
        ,reserveCnt  :"30"
    }

/*plan*/
    ,{
	    documentType:"plan"
        ,planID:"1"
        ,floorID:"1"
        ,planName:"지하1층.우측부."
    }
    ,{
	    documentType:"plan"
        ,planID:"2"
        ,floorID:"1"
        ,planName:"지하1층.좌측부."
    }
    ,{
	    documentType:"plan"
        ,planID:"3"
        ,floorID:"2"
        ,planName:"1층"
    }
    ,{
	    documentType:"plan"
        ,planID:"4"
        ,floorID:"3"
        ,planName:"2층"
    }


/*lnc*/
    ,{
        documentType:"lnc"
        ,floorID:"1"
        ,lncID:"1"
        ,currentStatus:"1"
    }
    ,{
        documentType:"lnc"
        ,floorID:"1"
        ,lncID:"2"
        ,currentStatus:"1"
    }
    ,{
        documentType:"lnc"
        ,floorID:"1"
        ,lncID:"3"
        ,currentStatus:"1"
    }
    ,{
        documentType:"lnc"
        ,floorID:"2"
        ,lncID:"4"
        ,currentStatus:"1"
    }
    ,{
        documentType:"lnc"
        ,floorID:"2"
        ,lncID:"5"
        ,currentStatus:"1"
    }
    ,{
        documentType:"lnc"
        ,floorID:"3"
        ,lncID:"6"
        ,currentStatus:"1"
    }
    ,{
         documentType:"BD"
        ,BDID:"1"
        ,lncID:"1"
        ,areaID:"1"
        ,drawing_top:"100"
        ,drawing_left:"100"
        ,currentStatus:"0"
    }
    ,{
         documentType:"BD"
        ,BDID:"1"
        ,lncID:"1"
        ,areaID:"1"
        ,drawing_top:"100"
        ,drawing_left:"100"
        ,currentStatus:"0"
    }
];
pcc.insert(data);

pcc.find().forEach(
    function (doc) {
        console.log(doc)
    },
    function () {
        console.log("loop end")
    }
)
