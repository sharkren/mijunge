var express = require('express');
var router = express.Router();

// TODO : 나중에 util js로 옮길예정
/*
  DB 입력을 위한 시간데이터 prototype 추가
*/
function datetime () {
    var d = new Date();
    var yyyy = d.getFullYear().toString();
    var MM = pad(d.getMonth() + 1,2);
    var dd = pad(d.getDate(), 2);
    var hh = pad(d.getHours(), 2);
    var mm = pad(d.getMinutes(), 2);
    var ss = pad(d.getSeconds(), 2);

    return yyyy + MM + dd+  hh + mm + ss;
}

/*
  시간 날짜 한자리일 경우 0 패딩
*/
function pad(number, length) {
    var str = '' + number;
    while (str.length < length) {
        str = '0' + str;
    }
    return str;
}

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

/* POST add user */
router.post('/add', function(req, res, next) {

  console.log('Add User Request Start');

  /* Mandatory Data Check Start*/
  // TODO : 필수 데이터 체크 로직
  //req.assert('companyName', 'Please fill the company name').notEmpty();
  //req.assert('companyTypeCd', 'Select the company type').notEmpty();
  //req.assert('busCount', 'Please fill the bus count').notEmpty();
  /* Mandatory Data Check End*/

  var errors = req.validationErrors();
  console.log('date [' +  datetime() + ']');

  if (!errors) {
    v_email = req.sanitize( 'email' ).escape().trim();
    v_password = req.sanitize( 'password' ).escape().trim();
    v_imagePath = req.sanitize( 'imagePath' ).escape().trim();
    v_nickname = req.sanitize( 'nickname' ).escape().trim();
    v_fcmToken = req.sanitize( 'fcmToken' ).escape().trim();
    v_joinDate = datetime();

    var user = {
        email: v_email,
        password: v_password,
        image_path: v_imagePath,
        nickname : v_nickname,
        fcm_token : v_fcmToken,
        join_date : v_joinDate
    };

    var insert_sql = 'INSERT INTO mijunge.user_info SET ?';
    req.getConnection(function(err,connection) {
        var query = connection.query(insert_sql, user, function(err, result){

            var message;
            var resutl;
            if(err) {
                console.log("fail " + err);
                resutl = 'E0001';
                message = err;
            }
            else {
                resutl = 'S0001';
                message = '회원 등록 성공';
            }

            result = {
                code: resutl,
                message: message
            };
            res.json(result);

        });
    });
  }
  else {
    var result = {
        code: 'E0001',
        message: errors
    };
  }

  console.log('Add User Request End');
});
module.exports = router;
