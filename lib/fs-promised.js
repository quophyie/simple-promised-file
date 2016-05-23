'use strict'

// Promisify doesn't work on all methods, so we'll need to do it manually

const Bluebird = require('bluebird')
const fs = Bluebird.promisifyAll(require('fs-extra'))
const fsStat = fs.stat
const fsRename = fs.rename
const fsMkdir = fs.mkdirs
const fsUnlink = fs.unlink
const fsEnsureDir = fs.ensureDir

// @todo: factory for there methods

fs.stat = (path) => {
  return new Bluebird((resolve, reject) => {
    fsStat(path, (err, res) => {
      if (err) return reject(err)
      resolve(res)
    })
  })
}

fs.rename = (path, newPath) => {
  return new Bluebird((resolve, reject) => {
    fsRename(path, newPath, (err, res) => {
      if (err) return reject(err)
      resolve(res)
    })
  })
}

fs.mkdir = (path, mode) => {
  return new Bluebird((resolve, reject) => {
    fsMkdir(path, mode, (err) => {
      if (err) return reject(err)
      resolve()
    })
  })
}

fs.unlink = (path) => {
  return new Bluebird((resolve, reject) => {
    fsUnlink(path, (err) => {
      if (err) return reject(err)
      resolve()
    })
  })
}

fs.ensureDir = (path) => {
  return new Bluebird((resolve, reject) => {
    fsEnsureDir(path, (err) => {
      if (err) return reject(err)
      resolve()
    })
  })
}

module.exports = fs
