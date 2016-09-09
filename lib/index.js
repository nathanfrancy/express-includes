var url = require('url');

function ImportMiddleware(options) {
  var self = this;

  self.globalStyles = options.globalStyles || [];
  self.globalScripts = options.globalScripts || [];
  self.pageDefinition = options.pageDefinition || [];
  self.sectionDefinition = options.sectionDefinition || [];

  self.mwFn = function(req, res, next) {
    var imports = self.getImports(url.parse(req.url).pathname);
    res.locals.scripts = imports.scripts;
    res.locals.styles = imports.styles;
    next();
  };

  self.getImports = function(url) {
    var styles = self.globalStyles;
    var scripts = self.globalScripts;

    return {
      styles: styles,
      scripts: scripts
    };
  };

  return self;
}

module.exports = ImportMiddleware;
