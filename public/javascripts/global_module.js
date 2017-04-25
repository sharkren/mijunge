/* DB 입력을 위한 시간데이터 prototype 추가 */
exports.getDate = function datetime () {
    var d = new Date();
    var yyyy = d.getFullYear().toString();
    var MM = pad(d.getMonth() + 1,2);
    var dd = pad(d.getDate(), 2);
    var hh = pad(d.getHours(), 2);
    var mm = pad(d.getMinutes(), 2);
    var ss = pad(d.getSeconds(), 2);

    return yyyy + MM + dd+  hh + mm + ss;
};

/* 시간 날짜 한자리일 경우 0 패딩 */
function pad(number, length) {
    var str = '' + number;
    while (str.length < length) {
        str = '0' + str;
    }
    return str;
}

/* 처리결과를 json으로 리턴*/
exports.getResult = function makeJson(code, message, result) {
  var retJson = {
    retCode : code,
    retMsg  : message,
    retData : result
  };

  return retJson;
};
