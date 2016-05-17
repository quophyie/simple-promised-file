'use strict'

const filesize = require('filesize')
const mime = require('mime')
const createError = require('create-error')

/**
 * Abstract class for manipulations with a file.
 */
class AbstractFile {

  /**
   * @param {string} path
   */
  constructor (path) {
    this.path = path
  }

  /**
   * @returns {string} Based on the file extension
   */
  get mime () {
    return mime.lookup(this.path)
  }

  /**
   * @returns {number} In bytes
   */
  get size () {
    return this.stats.size
  }

  /**
   * @returns {string} Human readable filesize
   */
  get sizeFormatted () {
    return filesize(this.stats.size)
  }

  /**
   * A unique file name based on file's extension
   *
   * @returns {string}
   */
  get extension () {
    let parts = this.path.split('.')
    if (!parts[1]) return

    return this.path.split('.').pop()
  }

  /**
   * @returns {ReadError} Cannot read a file in this.path
   */
  static get ReadError () {
    return createError('ReadError')
  }

  /**
   * @returns {TypeError} Invalid file type
   */
  static get TypeError () {
    return createError('TypeError')
  }

}

module.exports = AbstractFile
