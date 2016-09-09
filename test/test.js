var should = require('chai').should();

var config = require('./config');
var ImportMiddleware = require('./../index');

var mw = ImportMiddleware({
    globalStylesheets: config.globalStylesheets,
    globalScripts: config.globalScripts,
    sections: config.sectionDefinition,
    pages: config.pageDefinition,
    extras: config.extras
});

describe('global stylesheets', function() {

  it('should finish this test', function(done) {
    done();
  });

});
