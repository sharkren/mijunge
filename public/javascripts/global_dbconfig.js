/* middleware 라이브러리가 아니기 때문에 app.js의 전역 설정이 안됨
  sequelize 라이브러리 사용 선언
*/
var Sequelize = require('sequelize');

/* db접속 설정 */
var sequelize = new Sequelize('mijunge', 'map_user', 'map_user', {
    host: '127.0.0.1',
    dialect: 'mysql',

    pool: {
      max: 5,
      min: 0,
      idle: 10000
    }
  });

/* sequelize 모델 생성
    ** 모델은 반드시 pk값이 포함되어 있어야 함
    ** timestamps: false 설정은 data type이 날짜 컬럼은 제외하는 옵션
    ** ORM 라이브러리의 모든 특성인지는 모르겠으나 sequelize는 테이블 명을 복수로
       설정하여 자동으로 뒤에 s를 붙임
       freezeTableName: true 옵션은 테이블을 복수로 변경하지 않도록 설정

    sequelize.defind('db 테이블명')을 입력한 후에 컬럼을 추가하면 됨
    생성된 모델객체를 리턴
*/
exports.getUserInfo = function getUser() {
  var user_info = sequelize.define('user_info', {
      EMAIL: {
        type: Sequelize.STRING,
        primaryKey: true
      },
      PASSWORD: {
        type: Sequelize.STRING
      },
      IMAGE_PATH: {
        type: Sequelize.STRING
      },
      NICKNAME: {
        type: Sequelize.STRING
      },
      FCM_TOKEN: {
        type: Sequelize.STRING
      },
      LOGIN_TIME: {
        type: Sequelize.STRING
      },
      DELETE_CONF: {
        type: Sequelize.STRING
      },
      JOIN_DATE: {
        type: Sequelize.STRING
      }
    },
    {
      timestamps: false,
      freezeTableName: true
    }
  );
  return user_info;

};
