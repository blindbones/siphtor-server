const express = require('express');
const validate = require('express-validation');
const paramValidation = require('../../config/param-validation');
const likesCtrl = require('./controller');

const router = express.Router(); // eslint-disable-line new-cap

router.route('/')
  /** GET /api/likess - Get list of likess */
  .get(likesCtrl.list)

  /** POST /api/likess - Create new likes */
  //.post(validate(paramValidation.createlikes), likesCtrl.create);
  .post(likesCtrl.create);

router.route('/:_id')
  /** GET /api/likess/:likesId - Get likes */
  .get(likesCtrl.get)

  /** PUT /api/likess/:likesId - Update likes */
  .put(likesCtrl.update)

  .patch(likesCtrl.update)

  /** DELETE /api/likess/:likesId - Delete likes */
  .delete(likesCtrl.remove);

/** Load likes when API with likesId route parameter is hit */
// router.param('likesId', likesCtrl.load);

module.exports = router;
