var path = require('path');
var fs = require('fs');
module.exports.datadir = path.join(__dirname, "../data/sites.txt"); // tests will need to override this.

var headers = {'content-type':'text/html'};

var dataCollector = function(code, req, res) {
  res.writeHead(code, headers); // headers can get moved later?
  var htmlTag = '<input />' + req.url;
  res.end(htmlTag);
};

var dataDistrib = function (code, req, res) {
  var data = '';
  req.on('data', function (chunk) {
    data = chunk.split('url=').join('')+'\n';
    fs.writeFile(exports.datadir, data, function (err) {
      if (err) throw err;
    });
  });
  req.on('end', function (argument) {
    res.writeHead(code, headers);
    res.end();
  });
};


var actions = {
  'GET': function (req, res) {
    dataCollector(200, req, res); //okay
  },
  'POST': function (req, res) {
    dataDistrib (302, req, res); //created
  },
  'ERROR': function (req, res) {
    res.writeHead(404, headers);
    res.end();
  }
};


module.exports.handleRequest = function (req, res) {
  console.log(exports.datadir);
  if (req.url === '/arglebargle'){
    actions['ERROR'](req, res);
  } else if (actions[req.method] !== undefined) {
    actions[req.method](req, res);
  }
};
