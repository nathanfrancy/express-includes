var chai = require('chai')
    should = chai.should(),
    expect = chai.expect,
    assert = chai.assert;

var config = require('./config');
var IncludeMiddleware = require('./../lib/index');

var _imports = new IncludeMiddleware({
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

describe('invalid data', function() {

  it('should return null configs and empty scripts and styles array', function() {
    var _includesEmpty = new IncludeMiddleware();
    var i = _includesEmpty.getImports('/test-page');

    expect(i).to.not.equal(null);
    expect(i).to.not.equal(undefined);
    expect(i.scripts).to.be.an('array');
    expect(i.styles).to.be.an('array');
    expect(i.scripts.length).to.equal(0);
    expect(i.styles.length).to.equal(0);
    expect(i.pageConfig).to.equal(null);
    expect(i.sectionConfig).to.equal(null);
  });

  it('should not return styles if not an array', function() {
    var _includes = new IncludeMiddleware({
      pageDefinition: [
        {
          url: '/about/team',
          styles: { 'page': 'thing' }
        }
      ],
      sectionDefinition: [
          {
            url: '/about',
            scripts: "script.js"
          }
      ]
    });
    var i = _includes.getImports('/about/team');

    expect(i.scripts).to.be.an('array');
    expect(i.scripts.length).to.equal(0);
    expect(i.styles).to.be.an('array');
    expect(i.styles.length).to.equal(0);
  });

});

describe('minified files', function() {

  var minImports = new IncludeMiddleware({
    minified: true,
    dirName: __dirname,
    globalStyles: [ 
      'styles/style.css',
      'styles/responsive.css'
    ],
    globalScripts: [
      'scripts/jquery.js',
      'scripts/script.js'
    ],
    sectionDefinition: [
      {
        url: '/about/team',
        styles: [
          "styles/about.css"
        ],
        scripts: [
          "scripts/about.js"
        ]
      }
    ],
    pageDefinition: [
      {
        url: "/",
        styles: [
          "styles/home.css"
        ],
        scripts: [
          "scripts/home.js"
        ]
      },
      {
        url: "/about/team",
        styles: [
          "styles/team.css"
        ],
        scripts: [
          "scripts/team.js"
        ]
      },
      {
        url: "/about/team/:",
        styles: [
          "styles/team-member.css"
        ],
        scripts: [
          "scripts/team-member.js"
        ]
      }
    ]
  });

  it('creates styleFiles object with full and minified sources', function() {
    expect(minImports.styleFiles['styles/about.css']).to.not.equal(undefined);
    expect(minImports.styleFiles['styles/home.css']).to.not.equal(undefined);
    expect(minImports.styleFiles['styles/responsive.css']).to.not.equal(undefined);
    expect(minImports.styleFiles['styles/style.css']).to.not.equal(undefined);
    expect(minImports.styleFiles['styles/team.css']).to.not.equal(undefined);
    expect(minImports.styleFiles['styles/team-member.css']).to.not.equal(undefined);
  });

  it('generates minified css sources', function() {
    expect(minImports.styleFiles['styles/about.css'].min).to.equal('.about{width:100%;border:1px dotted #000}');
  });

  it('generates minified js sources', function() {
    expect(minImports.scriptFiles['scripts/script.js'].min).to.equal('var x=0;x++,console.log(x);');
  });

  describe('mwFnMinified', function() {

    it('should return a giant list of minified css', function(done) {
      var req = { url: '/about' };
      var res = { locals: {} };

      minImports.mwFnMinified(req, res,
        function() {
          expect(res.locals.cssSourceMin).to.equal('body{background-color:#00f}@media all and (max-device-width:800px){body{background-color:red}}');
          expect(res.locals.jsSourceMin).to.equal('function jQuery(){console.log("jQuery is fucking awesome."),this.ajax=function(){throw new Error("404 error lol")}}var $=jQuery;var x=0;x++,console.log(x);');
          done();
        });
    });

  });
  
});

describe('scss', function() {

  var sassImports = new IncludeMiddleware({
    minified: true,
    dirName: __dirname,
    globalStyles: [ 
      'styles/sass/style.scss',
      'styles/sass/responsive.scss'
    ]
  });

  it('should compile scss', function(done) {
    var req = { url: '/' };
      var res = { locals: {} };

      sassImports.mwFnMinified(req, res,
        function() {
          expect(res.locals.cssSourceMin).to.equal('div.thing{color:#111}div.thing span{display:inline-block}@media all and (min-width:320px){body{background-color:#111;color:#fff}}');
          done();
        });
  });

});