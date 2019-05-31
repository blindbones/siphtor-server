const express = require('express');
const validate = require('express-validation');
const paramValidation = require('../../config/param-validation');
const newsCtrl = require('./controller');

const router = express.Router(); // eslint-disable-line new-cap

router.route('/')
  /** GET /api/newss - Get list of newss */
  .get(newsCtrl.list)

  /** POST /api/newss - Create new news */
  //.post(validate(paramValidation.createNews), newsCtrl.create);
  .post(newsCtrl.create);

router.route('/:_id')
  /** GET /api/newss/:newsId - Get news */
  .get(newsCtrl.get)

  /** PUT /api/newss/:newsId - Update news */
  .put(validate(paramValidation.updateNews), newsCtrl.update)

  .patch(newsCtrl.update)

  /** DELETE /api/newss/:newsId - Delete news */
  .delete(newsCtrl.remove);

/** Load news when API with newsId route parameter is hit */
// router.param('newsId', newsCtrl.load);

module.exports = router;
