/* eslint-env mocha */
'use strict'

const chai = require('chai')
const image = require('../lib/image')
const path = require('path')
const gm = require('gm')

chai.should()

describe('Image', function () {
  let pth = path.join(__dirname, 'stubs', 'test.png')
  let img

  before((done) => {
    image(pth)
      .then((i) => {
        img = i
        done()
      })
      .catch((err) => {
        done(err)
      })
  })

  it('should calculate a correct size', () => {
    img.size.should.be.equal(26458)
  })

  it('should determine a correct formatted size', () => {
    img.sizeFormatted.should.be.equal('25.84 KB')
  })

  it('should determine a correct mime type', () => {
    img.mime.should.be.equal('image/png')
  })

  it('should contain all gm functions', () => {
    for (let key of Object.keys(gm.prototype)) {
      if (!img[key]) {
        return false
      }
    }

    return true
  })
})
