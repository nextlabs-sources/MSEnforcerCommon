const types = {
    object: '[object Object]',
    array: '[object Array]',
    reg_exp: '[object RegExp]',
    date: '[object Date]',
    null: '[object Null]',
    undefined: '[object Undefined]',
    number: '[object Number]',
    boolean: '[object Boolean]',
    string: '[object String]',
    math: '[object Math]',
}

function getClassName(obj) {
    return Object.prototype.toString.call(obj)
}

function escape(target, pattern, replaceValue) {
    
    const strType = getClassName(target)

    if(strType === types.string) {
        return target.replace(pattern, replaceValue)
    } else {
        console.log(`escape failed, target must be string type`)
    }
}

function escapeSingleQuotes(target) {

    const pattern = /\'/gi
    const value = '\''

    return escape(target, pattern, value)
}

function escapeDoubleQuotes(target) {

    const pattern = /\"/gi
    const value = '\"'

    return escape(target, pattern, value)
}

module.exports = {
    types,
    getClassName,
    escape,
    escapeSingleQuotes,
    escapeDoubleQuotes,
}