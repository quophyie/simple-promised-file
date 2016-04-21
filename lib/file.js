'use strict'

const fs = require('fs')
const AbstractFile = require('./abstract-file')

/**
 * Async version of the file implementation
 */
class File extends AbstractFile {

  /**
   * @param {string} path
   * @returns {Promise}
   */
  constructor (path) {
    super(path)
    this.stats

    return new Promise((resolve, reject) => {
      this._getStats()
        .then((stats) => {
          this.stats = stats
          resolve(this)
        })
        .catch((err) => {
          reject(err)
        })
    })
  }

  /**
   * Retrieve file stats
   * @returns {Promise}
   */
  _getStats () {
    return new Promise((resolve, reject) => {
      fs.stat(this.path, (err, stats) => {
        if (err) reject(err)

        if (stats && stats.isFile()) {
          resolve(stats)
        } else {
          reject('Invalid file path provided')
        }
      })
    })
  }
}

module.exports = File
