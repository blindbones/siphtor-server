var fs = require('fs');
var crypto = require('crypto');
var moment = require('moment')
var _ = require('lodash')

const config = require('../../config/config')



function upload (req, res, next) {
  if (req.files) {
    return res.json({ list: _.map(req.files, 'filename')})
  } else {
    return res.json({res:0})
  }
}

module.exports = { upload }
