const Comment = require('./model');

/**
 * Load comment and append to req.
 */
function load(req, res, next, id) {
  Comment.get(id)
    .then((comment) => {
      req.comment = comment; // eslint-disable-line no-param-reassign
      return next();
    })
    .catch(e => next(e));
}

/**
 * Get comment
 * @returns {Comment}
 */
function get(req, res, next) {
  let _id = req.query._id
  Comment.findOne({ _id })
    .populate('author')
    .then(comment => res.json(comment))
    .catch(e => next(e))
}

/**
 * Create new comment
 * @property {string} req.body.commentname - The commentname of comment.
 * @property {string} req.body.mobileNumber - The mobileNumber of comment.
 * @returns {Comment}
 */
function create(req, res, next) {
  const comment = new Comment({...req.body});
  comment.save()
    .then(savedComment => res.json(savedComment))
    .catch(e => next(e));
}

/**
 * Update existing comment
 * @property {string} req.body.commentname - The commentname of comment.
 * @property {string} req.body.mobileNumber - The mobileNumber of comment.
 * @returns {Comment}
 */
function update(req, res, next) {
  let user = req.body
  user.updatedAt = Date.now()
  Comment.updateOne({_id: req.body._id}, user)
    .then(rs => {
      if (rs.ok && rs.nModified > 0) {
      }
      return res.json(user)
    })
    .catch(e => next(e));
}

/**
 * Get comment list.
 * @property {number} req.query.skip - Number of comments to be skipped.
 * @property {number} req.query.limit - Limit number of comments to be returned.
 * @returns {Comment[]}
 */
function list(req, res, next) {
  const { pageSize = 20, page = 1 } = req.query;
  let limit = pageSize
  let skip = (page - 1) * pageSize
  Comment.list({ limit, skip })
    .then(comments => res.json(comments))
    .catch(e => next(e));
}

function listCommentsByNewsId(req, res, next) {
  let newsId = req.params.newsId || req.query.newsId
  const { pageSize = 20, page = 1 } = req.query;
  let limit = pageSize
  let skip = (page - 1) * pageSize
  Comment.listByNewsId({ limit, skip, newsId, user: req.session.user })
    .then(newss => res.json(newss))
    .catch(e => next(e));
}

/**
 * Delete comment.
 * @returns {Comment}
 */
function remove(req, res, next) {
  Comment.deleteOne({ _id: req.body._id })
    .then(deletedComment => res.json(deletedComment))
    .catch(e => next(e));
}

module.exports = { load, get, create, update, list, remove, listCommentsByNewsId };
