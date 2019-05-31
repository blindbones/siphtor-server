const config = require('../../config/config');
const multer = require('multer')

var storage = multer.diskStorage({
  destination: config.upload_dir,
  filename: function (req, file, cb) {
    var ext = ''
    file.originalname.replace(/\.(\w+)$/, function (m) {
      ext = m
    })
    cb(null, `${file.fieldname}-${Date.now()}${ext}`)
  }
})

var upload = multer({storage}).any()

function UploadMid (req, res, next) {
  upload(req, res, function(err){
    next()
  })
}

module.exports = UploadMid
