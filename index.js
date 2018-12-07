const {
    parse
} = require('@vue/component-compiler-utils');
const loaderUtils = require('loader-utils');
const path = require('path');
let compiler = require('vue-template-compiler');

var Linter = require('eslint').Linter;
var linter = new Linter();
const port = require('./lib/port');
// const rules = require(process.cwd() + '/.eslintrc');

module.exports = async function (source) {
    const {
        target,
        minimize,
        sourceMap,
        rootContext,
        resourcePath
    } = this;

    const options = loaderUtils.getOptions(this) || {};

    const isServer = target === 'node';
    const isProduction = options.productionMode || minimize || process.env.NODE_ENV === 'production';
    if (isServer || isProduction) {
        return source;
    }

    const filename = path.basename(resourcePath);
    const context = rootContext || process.cwd();
    const sourceRoot = path.dirname(path.relative(context, resourcePath));

    const descriptor = parse({
        source,
        compiler,
        filename,
        sourceRoot,
        needMap: sourceMap
    });

    let src = filename;

    if (descriptor.template && descriptor.template.content) {
        let templateStr = descriptor.template.content;
        let firstTagReg = /^<(.*?)>.*/;
        let result = firstTagReg.exec(templateStr.trimLeft());
        if (result && result.length && result.length > 1) {
            let matched = result[1];
            let replaceStr = templateStr.trimLeft().replace(new RegExp(`^<${matched}`, 'g'), `<${matched} data-file="${src}"`);
            source = source.replace(/<template>[\s\S]*<\/template>/i, '$`<template>\n' + replaceStr + '</template>$`');
        }
    }
    if (descriptor.script && descriptor.script.content) {
        let script = descriptor.script.content;
        let fport = await port.port();
        let insertedScript =
        `\n        this.$el.dataset.file && this.$el.addEventListener('click', e => {
            if (!e.altKey) return;
            e.stopPropagation();
            e.preventDefault();
            console.log('[goto component] 当前点击的组件：${filename}');
            fetch('http://localhost:${fport}/goto?path=${resourcePath}', { mode: 'no-cors' });
        });`;
        let mountedReg = /mounted\s*\(\s*\)\s*\{/;
        let mountedMatchs = mountedReg.exec(script);
        let replaceStr = '';
        if (mountedMatchs && mountedMatchs.length) {
            replaceStr = script.replace(mountedReg, 'mounted () {' + insertedScript);
        } else {
            let moduleReg = /(export\s?default\s?|module.exports\s?=\s?){/;
            let matches = moduleReg.exec(script);
            if (matches && matches.length > 1) {
                replaceStr = script.replace(moduleReg, 'export default {\n    mounted () {' + insertedScript + '\n    },// eslint-disable-line');
            }
        }
        let result = source.replace(/(<script.*>)([\s\S]*)<\/script>/, (mathes, $1) => {
            // let fix = linter.verifyAndFix(replaceStr, rules);
            return `${$1}${replaceStr}</script>`;
        });
        source = result;
    }

    return source;
};
