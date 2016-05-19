'use strict'

const File = require('./file')
const gm = require('gm')
const _ = require('lodash')
const Errors = require('./errors')

// A list of async gm getters
const getters = ['format', 'depth', 'color', 'res', 'filesize', 'identity', 'orientation']

/**
 * @param {string} getter
 * @param {object} resource
 * @returns {Function}
 */
const getterFactory = (getter, resource) => {
  return () => {
    return new Promise((resolve, reject) => {
      gm.prototype[getter].call(resource, (err, value) => {
        if (err) return reject(err)
        return resolve(value)
      })
    })
  }
}

/**
 * @param {object} resource
 * @returns {Promise}
 */
const writeFactory = (resource) => {
  return (path) => {
    return new Promise((resolve, reject) => {
      gm.prototype.write.call(resource, path, (err) => {
        if (err) return reject(err)
        return resolve()
      })
    })
  }
}

/**
 * @param {string} path
 * @returns {Promise}
 */
module.exports = (path) => {
  return new Promise((resolve, reject) => {
    let image

    new File(path)
      .then((img) => {
        image = img
        return img.isImage
      })
      .then((isImage) => {
        if (!isImage) throw new Errors.TypeError('This file is not an image')

        let resource = gm(path)

        resource.write = writeFactory(resource)

        // Override async gm getters with promise alternatives
        for (let getter of getters) {
          resource[getter] = getterFactory(getter, resource)
        }

        // size method is renamed to dimensions, because it is already use by parent file class
        resource.dimensions = getterFactory('size', resource)

        _.extend(image, resource)

        resolve(image)
      })
      .catch((err) => {
        reject(err)
      })
  })
}
