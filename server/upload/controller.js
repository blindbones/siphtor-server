const _ = require('lodash')

const config = require('../../config/config')

function upload (req, res, next) {
  if (req.files) {
    return res.json({ list: _.map(req.files, 'filename') })
  } else {
    return res.json({res:0})
  }
}

module.exports = { upload }
