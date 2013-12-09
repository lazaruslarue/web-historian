var path = require('path');
module.exports.datadir = path.join(__dirname, "../data/sites.txt"); // tests will need to override this.

var dataCollector = function(code, req, res) {
  res.writeHead(code, {'content-type':'text/html'}); // headers can get moved later?
  var htmlTag = '<input />' + req.url;
  res.write(htmlTag);
    
  res.end();
}

var actions = {
  'GET': function (req, res) {
    debugger;
    dataCollector(200, req, res);
  }
};

module.exports.handleRequest = function (req, res) {
  console.log(exports.datadir);
  console.log(req.url);
  if (actions[req.method] !== undefined) {
    actions[req.method](req, res);
  }
};
