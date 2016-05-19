'use strict'

const path = require('path')
const Image = require('../lib/image')

console.log(1)
Image(path.join(__dirname, '1.jpg'))
  .then((img) => {
    console.log(2)
    // We still have inherited File getters available
    console.log(img.size)

    console.log(img.extension)

    img.mime.then(console.log)
    img.isImage.then(console.log)

    img.dimensions()
      .then((dimensions) => {
        console.log(`Dimensions: ${dimensions.width}x${dimensions.height}px`)
      })

    // Async getters
    img.depth().then(console.log)

    // generate a unique name for a file
    img.uniqueName.then(console.log)

    // Image editing
    return img
      .resize(257, 257)
      .blur(23)
      .write(path.join(__dirname, '3.jpg'))
  })
  .then(() => {
    console.log('edited')
  })
  .catch(console.log)
