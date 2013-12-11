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

var siteGetter = function (url) {
  var name = "";
  request(url, function (err, resp, chunks) {
    if (err) throw err;
    name += md5(chunks) + ".html";
    console.log(name);
    fs.writeFile(__dirname + "/data/sites/" +  md5(chunks) + ".html", chunks+"", function (err) {
      if (err) throw err;
      console.log('It\'s saved!', __dirname + "/data/sites/" + name);
    });
  });
  return name;
};



var getUpdatesToDo = function () {
  var results = [];
  var query = 'SELECT * '+
              'FROM archive '+
              ' WHERE UNIX_TIMESTAMP(NOW()) - UNIX_TIMESTAMP(inserted_timestamp) > 200 ';
  console.log(query);
  connection.query(query).on('result', function(row) {
    results.push(row['url_vc250']);
  }).on('end', function(){
    return looper(results);
  });
};



var looper = function(urlArray) {
  for (var i = 0; i< urlArray.length; i++){
    var url = urlArray[i];
    getQuery(url);
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
    // connection.pause();
    doGetSite(url, oldMD5); 
  });
};

doGetSite = function (url, oldMD5) {
  var newMD5 = siteGetter(url); // check out siteGetter, make sure it returns at the right times
  return doPost(url, oldMD5, newMD5);
};


var doPost = function(url, oldMD5, newMD5 ){
  var query = 'INSERT INTO archive SET ?';
  var post  = {
    url_vc250    : url,
    newfile_vc250: newMD5,
    oldfile_vc250: oldMD5
  };
  // connection.resume();

  connection.query(query, post, function(err, result) {
  }).on('end', function () {

    console.log('success');
  });
};



/*

insert into archive (url_vc250) values ('http://www.weirdnano.com');
insert into archive (url_vc250) values ('http://www.hackreactor.com');
insert into archive (url_vc250) values ('http://www.amazon.com');
insert into archive (url_vc250) values ('http://www.yahoo.com');
*/