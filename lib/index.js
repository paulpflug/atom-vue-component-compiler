// Generated by CoffeeScript 1.9.3
(function() {
  var Directory, Promise, compiler, vcCompiler;

  compiler = require("vue-component-compiler");

  Directory = require("atom").Directory;

  Promise = require("bluebird");

  vcCompiler = null;

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
              file = dir.getSubdirectory(srcFolder).getFile(name + ".vue");
              compiledFile = dir.getSubdirectory(compiledFolder).getFile(name + ".js");
              if (!file.existsSync()) {
                promise = Promise.reject(new Error(srcFolder + "/" + name + ".vue doesn't exsist"));
              } else {
                promise = file.read(true).then(function(content) {
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