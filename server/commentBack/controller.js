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
function get(req, res) {
  return res.json(req.comment);
}

/**
 * Create new comment
 * @property {string} req.body.commentname - The commentname of comment.
 * @property {string} req.body.mobileNumber - The mobileNumber of comment.
 * @returns {Comment}
 */
function create(req, res, next) {
  const comment = new Comment({
    commentname: req.body.commentname,
    mobileNumber: req.body.mobileNumber
  });

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
  let comment = Comment.get(req.body._id);
  comment = Object.assign({}, {...comment}, {...req.body})

  comment.save()
    .then(savedComment => res.json(savedComment))
    .catch(e => next(e));
}

/**
 * Get comment list.
 * @property {number} req.query.skip - Number of comments to be skipped.
 * @property {number} req.query.limit - Limit number of comments to be returned.
 * @returns {Comment[]}
 */
function list(req, res, next) {
  const { limit = 50, skip = 0 } = req.query;
  Comment.list({ limit, skip })
    .then(comments => res.json(comments))
    .catch(e => next(e));
}

/**
 * Delete comment.
 * @returns {Comment}
 */
function remove(req, res, next) {
  const comment = req.comment;
  comment.remove()
    .then(deletedComment => res.json(deletedComment))
    .catch(e => next(e));
}

module.exports = { load, get, create, update, list, remove };
