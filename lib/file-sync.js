'use strict'

const fs = require('fs')
const AbstractFile = require('./abstract-file')

/**
 * Sync version of the file implementation
 */
class FileSync extends AbstractFile {

  /**
   * @param {string} constructor
   * @returns {Object}
   */
  constructor (path) {
    super(path)
    this.stats = fs.statSync(path)

    if (!this.stats || !this.stats.isFile()) {
      throw new Error('Invalid file provided')
    }

    return this
  }
}

module.exports = FileSync
