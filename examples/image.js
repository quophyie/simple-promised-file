'use strict'

const path = require('path')
const image = require('../lib/image')

image(path.join(__dirname, '1.jpg'))
  .then((img) => {
    // We still have inherited File getters available
    console.log(img.size)
    console.log(img.mime)

    // Async getters
    img
      .depth()
      .then((dim) => {
        console.log(dim)
      })

    // Image editing
    return img
      .resize(257, 257)
      .blur(23)
      .write(path.join(__dirname, '3.jpg'))
  })
  .then(() => {
    console.log('edited')
  })
  .catch((err) => {
    console.log(err)
  })
