'use strict'

const filesize = require('filesize')
const mime = require('mime')

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

}

module.exports = AbstractFile
