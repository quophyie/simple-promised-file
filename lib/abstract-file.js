'use strict'

const filesize = require('filesize')
const mime = require('mime')
const path = require('path')

/**
 * Abstract class for manipulations with a file.
 */
class AbstractFile {

  /**
   * @param {string} path
   */
  constructor (pth) {
    this.path = pth
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
    let ext = path.extname(this.path).slice(1)
    if (!ext.length) return
    return ext
  }
}

module.exports = AbstractFile
