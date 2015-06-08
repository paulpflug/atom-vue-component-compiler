# atom-vue-component-compiler

compiles a vue component with the help of [vue-component-compiler](https://github.com/vuejs/vue-component-compiler)

## Install

```sh
npm install atom-vue-component-compiler

```

## Usage
requiring `atom-vue-component-compiler`

returns a `Function(options)`

| Options   | Type    | Default | Usage                                   |
| --------: | ------- | ------ |:-------------------------------------- |
| packageName | string  | none | name of the package you are developing uses `atom.packages.resolvePackagePath` to find the required path|
| src    | string | "components"  | relative path to `vue` files|
| compiled      | string | "components_compiled" | relative path where `js` files will be saved |

calling this function returns another `Function(names)`

| Parameter | Type    | Usage                                   |
| --------: | ------- | :-------------------------------------- |
| names     | array   | names of the packages you want to compile (will be converted to kebab case) |

calling this function which will search in the `src` path of your package `for name in names` for `#{name}.vue` and compile it to `#{name}.js` and save it into the `compiled` path of your package.

This function returns a promise, which will be fulfilled when all files have been compiled.

## Example
```coffee
compile = require("atom-vue-component-compiler")(packageName:"your-package-name")
compile ["nested-comp","mainApp"] # will search for nested-comp.vue and main-app.vue
.then ->
  # everything successfully compiled
  # could load with "atom-vue-component-loader"
.catch (err) ->
  # there was a error in reading, compiling or writing
```



## Release History

 - *v0.0.2*: Converted to kebab naming
 - *v0.0.1*: First release

## License
Copyright (c) 2015 Paul Pflugradt
Licensed under the MIT license.
