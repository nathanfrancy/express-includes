var chai = require('chai')
    should = chai.should(),
    expect = chai.expect,
    assert = chai.assert;

var config = require('./config');
var ImportMiddleware = require('./../lib/index');

var _imports = new ImportMiddleware({
    globalStyles: config.globalStyles,
    globalScripts: config.globalScripts,
    sections: config.sectionDefinition,
    pages: config.pageDefinition
});

describe('getImports', function() {

  it('returns non-null or undefined object - no matches', function() {
    // Page that isn't configured. Should only return global styles and scripts.
    var imports = _imports.getImports('/asdkfshaufksldf');

    expect(imports).to.not.equal(null);
    expect(imports).to.not.equal(undefined);
    expect(imports).to.be.an('object');
    expect(imports.scripts).to.not.equal(null);
    expect(imports.scripts).to.not.equal(undefined);
    expect(imports.styles).to.not.equal(null);
    expect(imports.styles).to.not.equal(undefined);
  });

  describe('global', function() {

    it('returns arrays of styles & scripts - no matches', function() {
      // Page that isn't configured. Should only return global styles and scripts.
      var imports = _imports.getImports('/asdkfshaufksldf');

      expect(imports.styles).to.be.an('array');
      expect(imports.styles.length).to.equal(2);
      expect(imports.scripts).to.be.an('array');
      expect(imports.scripts.length).to.equal(2);
    });

    describe('styles', function() {

      it('should return global styles - no page or section matches', function() {
        var styles = _imports.getImports('/sldfuasdlfkuasdfl').styles;

        expect(styles.indexOf('style.css')).to.not.equal(-1);
        expect(styles.indexOf('responsive.css')).to.not.equal(-1);
      });

    });

    describe('scripts', function() {

      it('should return global styles - no page or section matches', function() {
        var scripts = _imports.getImports('/sldfuasdlfkuasdfl').scripts;

        expect(scripts.indexOf('script.js')).to.not.equal(-1);
        expect(scripts.indexOf('jquery.js')).to.not.equal(-1);
      });

    });

  });

});
