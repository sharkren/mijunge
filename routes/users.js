var express = require('express');
var router = express.Router();

// 전역 모듈과 상수 정의 파일 추가
var global_module = require('../public/javascripts/global_module');
var consts = require('../public/javascripts/consts');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

/* POST add user */
router.post('/add', function(req, res, next) {

  console.log('Add User Request Start');

  /* 입력값 체크 Start*/
  req.assert('email', 'Please fill the email').notEmpty();
  req.assert('password', 'Please the password').notEmpty();
  req.assert('imagePath', 'select your profile picture').notEmpty();
  /* 입력값 체크 End*/

  var errors = req.validationErrors();

  if (!errors) {

    // try-catch는 node내의 동기식 코드에 대해서만 작동하므로 Node내의 다른
    // 비동기 코드에서는 try-catch대신에 프라미스를 이용할수 있음
    try {
      v_email = req.sanitize( 'email' ).escape().trim();
      v_password = req.sanitize( 'password' ).escape().trim();
      v_imagePath = req.sanitize( 'imagePath' ).escape().trim();
      v_nickname = req.sanitize( 'nickname' ).escape().trim();
      v_fcmToken = req.sanitize( 'fcmToken' ).escape().trim();
      v_joinDate = global_module.getDate();
    }
    catch (e) {
      throw e;
    }

    var user = {
        email: v_email,
        password: v_password,
        image_path: v_imagePath,
        nickname : v_nickname,
        fcm_token : v_fcmToken,
        join_date : v_joinDate
    };

    var insert_sql = 'INSERT INTO mijunge.user_info SET ?';
    req.getConnection(function(err,connection){
      var query = connection.query(insert_sql, user, function(err, result){

        if(err) {
            res.json(global_module.getResult("E0003", consts.E0003, err));
        }
        else {
            res.json(global_module.getResult("S0001", consts.S0001, result));
        }

      });
    });
  }
  else {
    res.json(global_module.getResult("E0004", consts.E0004, errors));
  }

  console.log('Add User Request End');
});

module.exports = router;
