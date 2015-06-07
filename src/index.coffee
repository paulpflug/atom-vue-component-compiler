compiler = require "vue-component-compiler"
{Directory} = require "atom"
Promise = require "bluebird"

vcCompiler = null

module.exports = (options) ->
  throw new Error "name of the package required!" unless options?.packageName?
  packageName = options.packageName
  srcFolder = options.src ? "components"
  compiledFolder = options.compiled ? "components_compiled"
  return new class VCCompiler
    constructor: ->
      vcCompiler ?= (names) ->
        dir = new Directory(atom.packages.resolvePackagePath(packageName))
        compiled = []
        for name in names
          file = dir.getSubdirectory(srcFolder).getFile("#{name}.vue")
          compiledFile = dir.getSubdirectory(compiledFolder).getFile("#{name}.js")
          unless file.existsSync()
            promise = Promise.reject(new Error "#{srcFolder}/#{name}.vue doesn't exsist")
          else
            promise =  file.read(true)
              .then (content) ->
                return new Promise (resolve,reject) ->
                  reject new Error "file empty"  unless content?
                  compiler.compile content, (err,result) ->
                    if err
                      reject err
                      return
                    resolve result
              .then (result) -> compiledFile.write(result)
          compiled.push promise
        Promise.all compiled
      return vcCompiler
