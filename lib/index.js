(function() {
  var Directory, Promise, compiler, decamelize, promiseGenerator, vcCompiler;

  compiler = require("vue-component-compiler");

  Directory = require("atom").Directory;

  Promise = require("bluebird");

  vcCompiler = null;

  decamelize = function(str) {
    return str.replace(/\B([A-Z]{1})/g, function(match, chr) {
      return "-" + (chr.toLowerCase());
    });
  };

  promiseGenerator = function(file, compiledFile) {
    return file.read(true).then(function(content) {
      return new Promise(function(resolve, reject) {
        if (content == null) {
          reject(new Error("file empty"));
        }
        return compiler.compile(content, function(err, result) {
          if (err) {
            reject(err);
            return;
          }
          return resolve(result);
        });
      });
    }).then(function(result) {
      return compiledFile.write(result);
    });
  };

  module.exports = function(options) {
    var VCCompiler, compiledFolder, packageName, ref, ref1, srcFolder;
    if ((options != null ? options.packageName : void 0) == null) {
      throw new Error("name of the package required!");
    }
    packageName = options.packageName;
    srcFolder = (ref = options.src) != null ? ref : "components";
    compiledFolder = (ref1 = options.compiled) != null ? ref1 : "components_compiled";
    return new (VCCompiler = (function() {
      function VCCompiler() {
        if (vcCompiler == null) {
          vcCompiler = function(names) {
            var compiled, compiledFile, dir, file, i, len, name, promise;
            dir = new Directory(atom.packages.resolvePackagePath(packageName));
            compiled = [];
            for (i = 0, len = names.length; i < len; i++) {
              name = names[i];
              name = decamelize(name);
              file = dir.getSubdirectory(srcFolder).getFile(name + ".vue");
              if (!file.existsSync()) {
                promise = Promise.reject(new Error(srcFolder + "/" + name + ".vue doesn't exsist"));
              } else {
                compiledFile = dir.getSubdirectory(compiledFolder).getFile(name + ".js");
                promise = promiseGenerator(file, compiledFile);
              }
              compiled.push(promise);
            }
            return Promise.all(compiled);
          };
        }
        return vcCompiler;
      }

      return VCCompiler;

    })());
  };

}).call(this);
