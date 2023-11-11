/* eslint-disable @typescript-eslint/no-var-requires */
'use strict'

let _compose = require('./compose')

let _optional = require('./optional')

// eslint-disable-next-line no-var
function _objectSpread(target) { for (let i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; let ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable })) } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]) }) } return target }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }) } else { obj[key] = value } return obj }

/**
 * Composes all plugins together.
 *
 * @param {array} plugins - all plugins to load and initialize
 * @param {object} nextConfig - direct configuration for next.js (optional)
 */
const _withPlugins = ([...plugins], nextConfig = {}) => {return (phase, {
  defaultConfig
}) => {
  const config = _objectSpread({}, defaultConfig, nextConfig)

  return (0, _compose.composePlugins)(phase, plugins, config)
}}
/**
 * Extends a base next config.
 *
 * @param {function} baseConfig - basic configuration
 */


const extend = baseConfig => {return {
  withPlugins: (...params) => {return (phase, nextOptions) => {
    const processedBaseConfig = baseConfig(phase, nextOptions)
    return _withPlugins(...params)(phase, _objectSpread({}, nextOptions, {
      defaultConfig: processedBaseConfig
    }))
  }}
}} // define exports


const _exports = _withPlugins
_exports.withPlugins = _withPlugins
_exports.optional = _optional.markOptional
_exports.extend = extend
module.exports = _exports