const Reply = require('./model');

/**
 * Load reply and append to req.
 */
function load(req, res, next, id) {
  Reply.get(id)
    .then((reply) => {
      req.reply = reply; // eslint-disable-line no-param-reassign
      return next();
    })
    .catch(e => next(e));
}

/**
 * Get reply
 * @returns {Reply}
 */
function get(req, res, next) {
  let _id = req.query._id
  Reply.findOne({ _id })
    .populate('author')
    .then(reply => res.json(reply))
    .catch(e => next(e))
}

/**
 * Create new reply
 * @property {string} req.body.replyname - The replyname of reply.
 * @property {string} req.body.mobileNumber - The mobileNumber of reply.
 * @returns {Reply}
 */
function create(req, res, next) {
  const reply = new Reply({...req.body});
  reply.save()
    .then(savedReply => res.json(savedReply))
    .catch(e => next(e));
}

/**
 * Update existing reply
 * @property {string} req.body.replyname - The replyname of reply.
 * @property {string} req.body.mobileNumber - The mobileNumber of reply.
 * @returns {Reply}
 */
function update(req, res, next) {
  let user = req.body
  user.updatedAt = Date.now()
  Reply.updateOne({_id: req.body._id}, user)
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
 * @returns {Reply[]}
 */
function list(req, res, next) {
  const { pageSize = 20, page = 1 } = req.query;
  let limit = pageSize
  let skip = (page - 1) * pageSize
  Reply.list({ limit, skip })
    .then(replys => res.json(replys))
    .catch(e => next(e));
}

function listReplysByNewsId(req, res, next) {
  let newsId = req.params.newsId || req.query.newsId
  const { pageSize = 20, page = 1 } = req.query;
  let limit = pageSize
  let skip = (page - 1) * pageSize
  Reply.listByNewsId({ limit, skip, newsId })
    .then(newss => res.json(newss))
    .catch(e => next(e));
}

/**
 * Delete reply.
 * @returns {Reply}
 */
function remove(req, res, next) {
  Reply.deleteOne({ _id: req.body._id })
    .then(deletedReply => res.json(deletedReply))
    .catch(e => next(e));
}

module.exports = { load, get, create, update, list, remove, listReplysByNewsId };
