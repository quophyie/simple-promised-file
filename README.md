# @c8/simple-promised-file

A small promise library with basic file functionality and promise-wrapped gm image module.

## Features
- Detects and uses proper MIME type (based on file's "magic" bytes)
- Fully promised API
- ES 6 object model
- Image object wraps all graphicsmagic functionality, in a promised manner
- `fs-extra` file functions (also promise wrapped) available on all File objects

## Installation
`npm i @c8/simple-promised-file`
- Image functions require either GraphicsMagic or ImageMagic

## Usage
```javascript
'use strict'

const PromisedFile = require('@c8/simple-promised-file').Image
const File = PromisedFile.File
const Image = PromisedFile.Image // extends PromisedFile.File with gm package image functionality
```

### Get file info
```javascript
Image(path.join(__dirname, '1.jpg'))
  .then((img) => {
    // Sync getters
    console.log(img.size) // 32114 (bytes, preloaded)
    console.log(img.extension) // jpg

    // Async getters
    img.mime.then(console.log) // image/jpeg
    img.isImage.then(console.log) // true
    img.depth().then(console.log) // 8

    img.dimensions()
      .then((dimensions) => {
        console.log(`Dimensions: ${dimensions.width}x${dimensions.height}px`)
      })

    // etc
  })
  .catch(console.log)
```

### Get unique name
- generates a short URL-friendly name with a proper extension (based on file's magic bytes), uses `shortid`

```javascript
Image(path.join(__dirname, '1.jpg'))
  .then((img) => {
    return img.uniqueName
  })
  .then(console.log) // Sy8e7we7.jpg
  .catch(console.log)
```

### Edit an image
- Image object also provides all functionality of `gm` npm package in promised manner

```javascript
const blurAndResize = (img) => {
  return img
    .resize(257, 257)
    .blur(23)
    .write(path.join(__dirname, '3.jpg'))
}

Image(path.join(__dirname, '1.jpg'))
  .then(blurAndResize)
  .then(console.log)
  .catch(console.log)
```

## License
Developed for C8 MANAGEMENT LIMITED under MIT license
