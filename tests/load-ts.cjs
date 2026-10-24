const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const ts = require('typescript');
module.exports = function load(file) {
  const mod = { exports: {} };
  const localRequire = name => name.startsWith('.') ? load(path.resolve(path.dirname(file), name + '.ts')) : require(name);
  vm.runInNewContext(ts.transpileModule(fs.readFileSync(file, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText, {
    exports: mod.exports, module: mod, require: localRequire, Response, Request, URL, Buffer, AbortSignal, fetch, process, console,
  }, { filename: file });
  return mod.exports;
};
