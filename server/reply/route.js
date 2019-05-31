const express = require('express');
const validate = require('express-validation');
const paramValidation = require('../../config/param-validation');
const replyCtrl = require('./controller');

const router = express.Router(); // eslint-disable-line new-cap

router.route('/')
  /** GET /api/replys - Get list of replys */
  .get(replyCtrl.list)

  /** POST /api/replys - Create new reply */
  //.post(validate(paramValidation.createreply), replyCtrl.create);
  .post(replyCtrl.create);

router.route('/listReplysByNewsId/:newsId')
  .get(replyCtrl.listReplysByNewsId)

router.route('/:_id')
  /** GET /api/replys/:replyId - Get reply */
  .get(replyCtrl.get)

  /** PUT /api/replys/:replyId - Update reply */
  // .put(validate(paramValidation.updateReply), replyCtrl.update)
  .put(replyCtrl.update)

  .patch(replyCtrl.update)

  /** DELETE /api/replys/:replyId - Delete reply */
  .delete(replyCtrl.remove);

/** Load reply when API with replyId route parameter is hit */
// router.param('replyId', replyCtrl.load);


module.exports = router;
