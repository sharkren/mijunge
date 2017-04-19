var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  //res.render('index', { title: 'Express' });
  //console.log("request root" + connection);

  console.log("req  " + req.toString());

  req.getConnection(function(err,connection){

    //if (err) return next(err);
    var query = connection.query('SELECT * FROM test.customer', function(err,rows) {
        var errornya;
        if(err) {
          errornya  = ("Error Selecting : %s ",err );
        }
        for (var i = 0; i< rows.length; i++)
          console.log("select data " + rows[i].name);

        //req.flash('msg_error', errornya);
        //res.render('customer/list',{title:'Customers',data:rows});
        //res.render('list', { title: 'Express' });
        res.render('index',{title:'Customers',data:rows});
    });

  });

});

module.exports = router;
