var chai = require('chai')
    should = chai.should(),
    expect = chai.expect,
    assert = chai.assert;

var config = require('./config');
var ImportMiddleware = require('./../lib/index');

var _imports = new ImportMiddleware({
    globalStyles: config.globalStyles,
    globalScripts: config.globalScripts,
    sectionDefinition: config.sectionDefinition,
    pageDefinition: config.pageDefinition
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

      it('should return global styles - section match', function() {
        var styles = _imports.getImports('/about/team').styles;

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

      it('should return global styles - section match', function() {
        var scripts = _imports.getImports('/about/team').scripts;

        expect(scripts.indexOf('script.js')).to.not.equal(-1);
        expect(scripts.indexOf('jquery.js')).to.not.equal(-1);
      });

    });

  });

});

describe('getSectionConfig', function() {

  describe('invalid url', function() {

    it('should return null if passed undefined', function() {
      var section = _imports.getSectionConfig(undefined);
      expect(section).to.equal(null);
    });

    it('should return null if passed null', function() {
      var section = _imports.getSectionConfig(null);
      expect(section).to.equal(null);
    });

    it('should return null if passed non-matched url', function() {
      var section = _imports.getSectionConfig('/thing-that-does-not-match');
      expect(section).to.equal(null);
    });

  });

  describe('valid url', function() {

    it('should return a config', function() {
      var section = _imports.getSectionConfig('/about/team');

      expect(section).to.not.equal(null);
      expect(section).to.be.an('object');
      expect(section.url).to.not.equal(undefined);
      expect(section.styles).to.not.equal(undefined);
      expect(section.scripts).to.not.equal(undefined);
    });

    it('should return the section styles and scripts', function() {
      var section = _imports.getSectionConfig('/about/team');
      expect(section.url).to.equal('/about');
      expect(section.scripts.indexOf('about.js')).to.not.equal(-1);
      expect(section.styles.indexOf('about.css')).to.not.equal(-1);
    });

  });

});

describe('getPageConfig', function() {

  it('returns null if null url', function() {
    var pageConfig = _imports.getPageConfig(null);
    expect(pageConfig).to.equal(null);
  });

  it('returns null if null url', function() {
    var pageConfig = _imports.getPageConfig(undefined);
    expect(pageConfig).to.equal(null);
  });

  it('should return null if passed non-matched url', function() {
    var pageConfig = _imports.getPageConfig('/thing-that-does-not-match');
    expect(pageConfig).to.equal(null);
  });

  describe('valid page matches', function() {

    it('should work with url that matches exactly', function() {
      var pageConfig = _imports.getPageConfig('/about/team');
      expect(pageConfig).to.not.equal(null);
      expect(pageConfig.styles.indexOf('team.css')).to.not.equal(-1);
      expect(pageConfig.scripts.indexOf('team.js')).to.not.equal(-1);
      // Wouldnt expect team-member to be in just the team page.
      expect(pageConfig.scripts.indexOf('team-member.js')).to.equal(-1);
      // Wouldn't expect css to be in the scripts array.
      expect(pageConfig.scripts.indexOf('team.css')).to.equal(-1);
    });

    it('should work with url path parameter', function() {
      var pageConfig = _imports.getPageConfig('/about/team/nathan');
      expect(pageConfig).to.not.equal(null);
      expect(pageConfig.styles.indexOf('team-member.css')).to.not.equal(-1);
      expect(pageConfig.scripts.indexOf('team-member.js')).to.not.equal(-1);
    });

  });

});

describe('mwFn', function() {

  it('should always call next', function(done) {
    var req = { url: '/about' };
    var res = { locals: {} };

    _imports.mwFn(req, res,
      // 'next' function
      function() {
        done();
      });
  });

  it('should have scripts & styles as arrays in res.locals', function(done) {
    var req = { url: '/about' };
    var res = { locals: {} };

    _imports.mwFn(req, res,
      // 'next' function
      function() {
        expect(res.locals.scripts).to.not.equal(null);
        expect(res.locals.scripts).to.not.equal(undefined);
        expect(res.locals.scripts).to.be.an('array');
        expect(res.locals.styles).to.not.equal(null);
        expect(res.locals.styles).to.not.equal(undefined);
        expect(res.locals.styles).to.be.an('array');
        done();
      });
  });

  it('should have scripts and styles in \'res\' object', function(done) {
    var req = { url: '/about' };
    var res = { locals: {} };

    _imports.mwFn(req, res,
      // 'next' function
      function() {
        expect(res.locals.scripts.indexOf('script.js')).to.not.equal(-1);
        expect(res.locals.scripts.indexOf('scripts.js')).to.equal(-1);
        expect(res.locals.scripts.indexOf('jquery.js')).to.not.equal(-1);
        expect(res.locals.styles.indexOf('style.css')).to.not.equal(-1);
        expect(res.locals.styles.indexOf('styles.css')).to.equal(-1);
        expect(res.locals.styles.indexOf('responsive.css')).to.not.equal(-1);
        done();
      });
  });

});
