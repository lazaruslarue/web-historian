var sql = require('mysql');
var fs = require('fs'); // and all that jazz
var request = require('request'); // this is teh funk
var md5 = require('MD5');
var exports = {}, __dirname = '/Users/hackreactor/code/mrspothawk/2013-11-web-historian';
var connection = sql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : 'plantlife',
  database : 'TeamBallerAwesome5',
  table    : 'archive'
});

connection.connect();
  // connection.end();

exports.readUrls = function(filePath, cb){
  fs.readFile(filePath, 'utf8', function (err, data) {
    if (err) throw err;
    cb(data.split('\n')); // ['asdf','saf','sadf']
  });
};

exports.downloadUrls = function(filePath){
  filePath = filePath || __dirname + "/data/sites.txt";
  var cb = function (urls) {
    for (var i = 0; i < urls.length; i++ ) {
      var url = urls[i];
      request(url, function (err, resp, chunks) {
        var name = md5(chunks+"");
        fs.writeFile(__dirname + "/data/sites/" + name +".html", chunks+"", function (err) {
          if (err) throw err;
          console.log('It\'s saved!', __dirname + "/data/sites/" + name);
        });
      });
    }
  };
  exports.readUrls(filePath, cb);
  return 'success!';
};




var checkLastUpdate = function(urlArray) {
  for (var i = 0; i< urlArray; i++){
    runQuery( urlArray[i] );
  }
};


var getQuery = function (url) {
  var query = 'SELECT * '+
              'FROM archive '+
              'WHERE url_vc250 = \''+ url + '\' '+
              ' and UNIX_TIMESTAMP(NOW()) - UNIX_TIMESTAMP(inserted_timestamp) > 200 '+
              'ORDER BY inserted_timestamp DESC LIMIT 0,1';
  console.log(query);
  connection.query(query).on('result', function(row) {
    if (!row) {return;}
    var oldMD5 = row['oldfile_vc250'];
    var url = row['url_vc250'];
    connection.pause();
    doPost(url, oldMD5);
  });

};

var doPost = function(url, oldMD5){
  var query = 'INSERT INTO archive SET ?';
  var post  = {
    url_vc250    : url,
    newfile_vc250: fileMD5(url),
    oldfile_vc250: oldMD5
  };
  connection.resume();

  connection.query(query, post, function(err, result) {
  }).on('end', function () {

    console.log('success');
  });


  //   collect data,
  //   newMD5 = hash(data)
};



/*




TODO:
Namescheme for filenames /md5.html

ec: ** check for changes **

*/


//  url       date        old               current
// |google|10/01/2013    |md503475035470934|md503475035470934
// |google|10/02/2013    |md503475035470934|md503475035470934
// |google|10/03/2013    |md503475035470934|md503475035470935
/*
+--------------------+--------------+------+-----+-------------------+----------------+
| Field              | Type         | Null | Key | Default           | Extra          |
+--------------------+--------------+------+-----+-------------------+----------------+
| id_int4            | int(11)      | NO   | PRI | NULL              | auto_increment |
| url_vc250          | varchar(250) | YES  |     | NULL              |                |
| inserted_timestamp | timestamp    | NO   |     | CURRENT_TIMESTAMP |                |
| newfile_vc250      | varchar(250) | YES  |     | NULL              |                |
| oldfile_vc250      | varchar(250) | YES  |     | NULL              |                |
+--------------------+--------------+------+-----+-------------------+----------------+
*/