const express = require('express');
const validate = require('express-validation');
const paramValidation = require('../../config/param-validation');
const friendCtrl = require('./controller');

const router = express.Router(); // eslint-disable-line new-cap

router.route('/')
  /** GET /api/friends - Get list of friends */
  .get(friendCtrl.list)

  /** POST /api/friends - Create new friend */
  //.post(validate(paramValidation.createfriend), friendCtrl.create);
  .post(friendCtrl.create)

  .delete(friendCtrl.remove);

router.route('/listFriendsByNewsId/:newsId')
  .get(friendCtrl.listFriendsByNewsId)

router.route('/:_id')
  /** GET /api/friends/:friendId - Get friend */
  .get(friendCtrl.get)

  /** PUT /api/friends/:friendId - Update friend */
  // .put(validate(paramValidation.updateFriend), friendCtrl.update)
  .put(friendCtrl.update)

  .patch(friendCtrl.update)

  /** DELETE /api/friends/:friendId - Delete friend */
  .delete(friendCtrl.remove);

/** Load friend when API with friendId route parameter is hit */
// router.param('friendId', friendCtrl.load);


module.exports = router;
