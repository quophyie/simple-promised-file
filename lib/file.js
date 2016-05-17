'use strict'

const fs = require('fs')
const AbstractFile = require('./abstract-file')
const fileType = require('file-type')
const readChunk = require('read-chunk')
const shortid = require('shortid')

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
          reject(new File.ReadError(err.message))
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
          reject(`Error reading file stats for ${this.path}`)
        }
      })
    })
  }

  /**
   * First try to determine mime by reading magic bytes, it that fails, falls back to extension check.
   *
   * @returns {Promise}
   */
  get mime () {
    return new Promise((resolve, reject) => {
      this.type
        .then((type) => {
          resolve(type.mime)
        })
        .catch(() => {
          resolve(super.mime)
        })
    })
  }

  /**
   * A unique file name based on file's extension
   *
   * @returns {string}
   */
  get uniqueName () {
    const generateName = (ext) => {
      let fullName = shortid.generate()
      if (ext) {
        fullName += `.${ext}`
      }

      return fullName
    }

    return new Promise((resolve, reject) => {
      this.type
        .then((type) => {
          // first try to determine the extension based on the actual file type
          resolve(generateName(type.ext))
        })
        .catch(() => {
          // otherwise just use the file extension, if any
          let ext = this.extension
          if (ext) return resolve(generateName(ext))

          resolve(generateName())
        })
    })
  }

  /**
   * Get file type by reading first 'magic' bytes.
   *
   * @returns {Promise}
   */
  get type () {
    return new Promise((resolve, reject) => {
      readChunk(this.path, 0, 262)
        .then((buffer) => {
          let type = fileType(buffer)

          if (type.mime) return resolve(type)
          reject()
        })
        .catch((err) => {
          reject(err)
        })
    })
  }

  /**
   * Checks whether the file is an image based on magic number on start of the file (file-type npm package)
   *
   * @return {Boolean} [description]
   */
  get isImage () {
    return new Promise((resolve, reject) => {
      this.type
        .then((type) => {
          resolve(type.mime.split('/')[0] === 'image')
        })
        .catch(() => {
          resolve(false) // for now sufficient
        })
    })
  }
}

module.exports = File
