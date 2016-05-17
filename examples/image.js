'use strict'

const path = require('path')
const Image = require('../lib/image')

Image(path.join(__dirname, '1.txt'))
  .then((img) => {
    // We still have inherited File getters available
    console.log(img.size)

    img.mime
      .then((mime) => {
        console.log(`Mime: ${mime}`)
      })

    img.isImage
      .then((result) => {
        console.log(`IsImage: ${result}`)
      })

    // Async getters
    img
      .depth()
      .then((dim) => {
        console.log(dim)
      })

    // generate a unique name for a file
    img.uniqueName
      .then((name) => {
        console.log(name)
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
