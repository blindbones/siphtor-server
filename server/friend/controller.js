const Friend = require('./model');

/**
 * Load reply and append to req.
 */
function load(req, res, next, id) {
  Friend.get(id)
    .then((reply) => {
      req.reply = reply; // eslint-disable-line no-param-reassign
      return next();
    })
    .catch(e => next(e));
}

/**
 * Get reply
 * @returns {Friend}
 */
function get(req, res, next) {
  let _id = req.query._id
  Friend.findOne({ _id })
    .populate('author')
    .then(reply => res.json(reply))
    .catch(e => next(e))
}

/**
 * Create new reply
 * @property {string} req.body.replyname - The replyname of reply.
 * @property {string} req.body.mobileNumber - The mobileNumber of reply.
 * @returns {Friend}
 */
function create(req, res, next) {
  const reply = new Friend({...req.body});
  reply.save()
    .then(savedFriend => res.json(savedFriend))
    .catch(e => next(e));
}

/**
 * Update existing reply
 * @property {string} req.body.replyname - The replyname of reply.
 * @property {string} req.body.mobileNumber - The mobileNumber of reply.
 * @returns {Friend}
 */
function update(req, res, next) {
  let user = req.body
  user.updatedAt = Date.now()
  Friend.updateOne({_id: req.body._id}, user)
    .then(rs => {
      if (rs.ok && rs.nModified > 0) {
      }
      return res.json(user)
    })
    .catch(e => next(e));
}

/**
 * Get reply list.
 * @property {number} req.query.skip - Number of replys to be skipped.
 * @property {number} req.query.limit - Limit number of replys to be returned.
 * @returns {Friend[]}
 */
function list(req, res, next) {
  const { pageSize = 20, page = 1 } = req.query;
  let limit = pageSize
  let skip = (page - 1) * pageSize
  Friend.list({ limit, skip })
    .then(replys => res.json(replys))
    .catch(e => next(e));
}

function listFriendsByNewsId(req, res, next) {
  let newsId = req.params.newsId || req.query.newsId
  const { pageSize = 20, page = 1 } = req.query;
  let limit = pageSize
  let skip = (page - 1) * pageSize
  Friend.listByNewsId({ limit, skip, newsId })
    .then(newss => res.json(newss))
    .catch(e => next(e));
}

/**
 * Delete reply.
 * @returns {Friend}
 */
function remove(req, res, next) {
  Friend.deleteOne({ _id: req.body._id })
    .then(deletedFriend => res.json(deletedFriend))
    .catch(e => next(e));
}

module.exports = { load, get, create, update, list, remove, listFriendsByNewsId };
