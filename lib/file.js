'use strict'

const fs = require('./fs-promised')
const AbstractFile = require('./abstract-file')
const fileType = require('file-type')
const readChunk = require('read-chunk')
const shortid = require('shortid')
const path = require('path')
const Errors = require('./errors')

/**
 * Async version of the file implementation
 */
class File extends AbstractFile {

  /**
   * @param {string} path
   * @returns {Promise}
   */
  constructor (pth) {
    super(pth)

    /**
     * @member {boolean} _image determines whether thefileis an image
     */
    this._image

    /**
     * @member {object} _type format - {ext: 'jpg', mime: 'image/jpeg'}
     */
    this._type

    /**
     * @member {object} stats node fs.stat object
     */
    this.stats

    return new Promise((resolve, reject) => {
      // I am mostly interested whether the file exists
      this._getStats()
        .then((stats) => {
          this.stats = stats
          resolve(this)
        })
        .catch((err) => {
          reject(new Errors.ReadError(err.message))
        })
    })
  }

  /**
   * Retrieve file stats
   * @returns {Promise}
   */
  _getStats () {
    return fs.stat(this.path)
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
      if (ext) fullName += `.${ext}`
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
    if (typeof this._type === 'boolean') return Promise.resolve(this._type) // do this only once

    return new Promise((resolve, reject) => {
      readChunk(this.path, 0, 262)
        .then((buffer) => {
          this._type = fileType(buffer)

          if (this._type.mime) return resolve(this._type)
          reject()
        })
        .catch(reject)
    })
  }

  /**
   * Checks whether the file is an image based on magic number on start of the file (file-type npm package)
   *
   * @returns {Promise} Resolving in image being or not being an image
   */
  get isImage () {
    if (typeof this._image === 'boolean') return Promise.resolve(this._image) // do this only once

    return new Promise((resolve, reject) => {
      this.type
        .then((type) => {
          this._image = type.mime.split('/')[0] === 'image'
          resolve(this._image)
        })
        .catch(() => {
          this._image = false
          resolve(false) // for now sufficient
        })
    })
  }

  /**
   * @return {string}
   */
  get dir () {
    return path.dirname(this.path)
  }

  /**
   * @return {string} Includes extension, for example: myfile.jpg
   */
  get basename () {
    return path.basename(this.path)
  }

  /**
   * Move a file to a new place on disk
   * @param {string} newPath
   * @returns {Promise}
   */
  move (newPath) {
    return new Promise((resolve, reject) => {
      let newDir = path.dirname(newPath)

      const rename = () => {
        return fs.rename(this.path, newPath)
          .then(() => {
            this.path = newPath
            resolve(newPath)
          })
          .catch(reject)
      }

      fs.ensureDir(newDir)
        .then(rename)
        .catch(reject)
    })
  }

  /**
   * Move a file to a new place on disk without renaming
   * @param {string} newDir
   * @returns {Promise}
   */
  moveToDir (newDir) {
    let newPath = path.join(newDir, this.basename)
    return this.move(newPath)
  }

  /**
   * Renames a file within one directory
   * @param {string} newName
   * @returns {Promise}
   */
  rename (newName) {
    let newPath = path.join(this.dir, newName)
    return this.move(newPath)
  }

  /**
   * Deletes this file from this.path
   */
  delete () {
    return fs.unlink(this.path)
  }
}

module.exports = File
