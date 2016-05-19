'use strict'

const createError = require('create-error')

module.exports = {
  ReadError: createError('ReadError'),
  TypeError: createError('TypeError')
}
