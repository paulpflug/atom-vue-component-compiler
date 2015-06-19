# out: ../lib/index.js

compiler = require "vue-component-compiler"
{Directory} = require "atom"
Promise = require "bluebird"

decamelize = (str) ->
  str.replace /\B([A-Z]{1})/g, (match, chr) ->
    "-#{chr.toLowerCase()}"

promiseGenerator = (file,compiledFile) ->
  return file.read(true)
    .then (content) ->
      return new Promise (resolve,reject) ->
        reject new Error "file empty"  unless content?
        compiler.compile content, (err,result) ->
          if err
            reject err
            return
          resolve result
    .then (result) -> compiledFile.write(result)

module.exports = (options) ->
  throw new Error "name of the package required!" unless options?.packageName?
  packageName = options.packageName
  srcFolder = options.src ? "components"
  compiledFolder = options.compiled ? "components_compiled"
  return (names) ->
    dir = new Directory(atom.packages.resolvePackagePath(packageName))
    compiled = []
    for name in names
      name = decamelize(name)
      file = dir.getSubdirectory(srcFolder).getFile("#{name}.vue")
      console.log file
      unless file.existsSync()
        promise = Promise.reject(new Error "#{srcFolder}/#{name}.vue doesn't exsist")
      else
        compiledFile = dir.getSubdirectory(compiledFolder).getFile("#{name}.js")
        promise = promiseGenerator file, compiledFile
      compiled.push promise
    Promise.all compiled
