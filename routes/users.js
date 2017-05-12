var express = require('express');
var router = express.Router();

// 전역 모듈과 상수 정의 파일 추가
var global_module = require('../public/javascripts/global_module');
var consts = require('../public/javascripts/consts');

/* DB config js file */
var global_dbconfig = require('../public/javascripts/global_dbconfig');

/* GET users listing. */
router.get('/', function(req, res, next) {

  /* sequelize 전역 설정에서 모델을 생성하고 그 모델 객체로 테이블 조회*/
  /* where conditions
    $and: {a: 5}           // AND (a = 5)
    $or: [{a: 5}, {a: 6}]  // (a = 5 OR a = 6)
    $gt: 6,                // > 6
    $gte: 6,               // >= 6
    $lt: 10,               // < 10
    $lte: 10,              // <= 10
    $ne: 20,               // != 20
    $eq: 3,                // = 3
    $not: true,            // IS NOT TRUE
    $between: [6, 10],     // BETWEEN 6 AND 10
    $notBetween: [11, 15], // NOT BETWEEN 11 AND 15
    $in: [1, 2],           // IN [1, 2]
    $notIn: [1, 2],        // NOT IN [1, 2]
    $like: '%hat',         // LIKE '%hat'
    $notLike: '%hat'       // NOT LIKE '%hat'
    $iLike: '%hat'         // ILIKE '%hat' (case insensitive) (PG only)
    $notILike: '%hat'      // NOT ILIKE '%hat'  (PG only)
    $like: { $any: ['cat', 'hat']}
                           // LIKE ANY ARRAY['cat', 'hat'] - also works for iLike and notLike
    $overlap: [1, 2]       // && [1, 2] (PG array overlap operator)
    $contains: [1, 2]      // @> [1, 2] (PG array contains operator)
    $contained: [1, 2]     // <@ [1, 2] (PG array contained by operator)
    $any: [2,3]            // ANY ARRAY[2, 3]::INTEGER (PG only)
  */
  global_dbconfig.getUserInfo().findAll({
    where: {
      EMAIL: 'test@test.com', // where 절 조건 입력
      $and: [{NICKNAME: 'hulk'}]
      //$or: [{NICKNAME: 'hulk'},{EMAIL: 'test@test.com'}]
    },
    /* 조회할 컬럼명 입력, 입력하지 않으면 모든 컬럼 조회 */
    attributes: ['EMAIL', 'NICKNAME']
  }).then(function(user_info) {
    /* 조회에 성공하면 callback function  파라미터로 결과값 전달 */
    console.log(user_info);
    res.json(global_module.getResult("S0001", consts.S0001, user_info));
  });

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
