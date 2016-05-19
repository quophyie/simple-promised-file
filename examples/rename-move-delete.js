'use strict'

const path = require('path')
const File = require('../lib/file')

let file = {}

new File(path.join(__dirname, '1.jpg'))
  .then((f) => {
    file = f
    return file.rename('2.jpg')
  })
  .then(() => {
    return file.moveToDir(path.join(__dirname, 'newDir', 'fuck'))
  })
  .then(() => {
    return file.delete()
  })
  .then(() => {
    console.log('file moved and removed')
  })
  .catch(console.log)
