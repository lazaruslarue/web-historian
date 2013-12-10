var stubs = require("./helpers/stubs");
var htmlFetcherHelpers = require("../workers/lib/html-fetcher-helpers");
var fs = require("fs");
var path = require('path');
var filePath = path.join(__dirname, "/testdata/sites.txt");

describe("html fetcher helpers", function(){

  it("should have a 'readUrls' function", function(){
    var urlArray = ["http://www.example1.com", "http://www.example2.com"];


    fs.writeFileSync(filePath, urlArray.join("\n"));

    var resultArray;

    runs(function(){
      htmlFetcherHelpers.readUrls(filePath, function(urls){
        resultArray = urls;
      });
    });

    waits(1000);

    runs(function() {
      expect(resultArray).toEqual(urlArray);
    });
  });

  it("should have a 'downloadUrls' function", function(){
    var result = htmlFetcherHelpers.downloadUrls(filePath);
    waits(1);
    expect(result).toBeTruthy();
  });
});
