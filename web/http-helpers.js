var path = require('path');
var fs = require('fs');

exports.headers = headers = {
  "access-control-allow-origin": "*",
  "access-control-allow-methods": "GET, POST, PUT, DELETE, OPTIONS",
  "access-control-allow-headers": "content-type, accept",
  "access-control-max-age": 10, // Seconds.
  'Content-Type': "text/html"
};

exports.serveStaticAssets = function(res, folder, asset) {
  if (asset === '/') {asset = '/index.html';}
  var fullpath = path.join();
  if (fs.fileExists(fullpath)) {
    var contents = fs.readFileSync(fullpath, 'utf8');
    exports.sendResponse(res, undefined, 404);
  }
};

// As you go through, keep thinking about what helper functions you can put here!