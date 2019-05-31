const Likes = require('./model');
const Comment = require('../comment/model')
const News = require('../news/model')

/**
 * Load likes and append to req.
 */
function load(req, res, next, id) {
  Likes.get(id)
    .then((likes) => {
      req.likes = likes; // eslint-disable-line no-param-reassign
      return next();
    })
    .catch(e => next(e));
}

/**
 * Get likes
 * @returns {Likes}
 */
function get(req, res, next) {
  let _id = req.params._id || req.query._id
  Likes.findOne({ _id })
    .populate('author')
    .then(likes => res.json(likes))
    .catch(e => next(e))
}

/**
 * Create new likes
 * @property {string} req.body.likesname - The likesname of likes.
 * @property {string} req.body.mobileNumber - The mobileNumber of likes.
 * @returns {Likes}
 */
function create(req, res, next) {
  const likes = new Likes({...req.body});
  const { refererType, type, referer } = req.body

  if (refererType === 'news') {
    News.updateOne({ _id: referer }, { $inc: { likeCount: 1 } })
      .then(rs => {
        console.log('updateOne rs', rs)
      }, err => {
        console.log('updateOne err', err)
      })
  }

  if (refererType === 'comment') {
    let incOpt = { likeCount: 1 }
    if (type === 'dislike') {
      incOpt = { dislikeCount: 1 }
    }
    Comment.updateOne({ _id: referer, }, { $inc: incOpt })
      .then(rs => {
        console.log('updateOne rs', rs)
      }, err => {
        console.log('updateOne err', err)
      })
  }

  likes.save()
    .then(savedLikes => res.json(savedLikes))
    .catch(e => next(e));
}

/**
 * Update existing likes
 * @property {string} req.body.likesname - The likesname of likes.
 * @property {string} req.body.mobileNumber - The mobileNumber of likes.
 * @returns {Likes}
 */
function update(req, res, next) {
  let user = req.body
  user.updatedAt = Date.now()
  Likes.updateOne({_id: req.body._id}, user)
    .then(rs => {
      if (rs.ok && rs.nModified > 0) {
      }
      return res.json(user)
    })
    .catch(e => next(e));
}

/**
 * Get likes list.
 * @property {number} req.query.skip - Number of likess to be skipped.
 * @property {number} req.query.limit - Limit number of likess to be returned.
 * @returns {Likes[]}
 */
function list(req, res, next) {
  const { pageSize = 20, page = 1 } = req.query;
  let limit = pageSize
  let skip = (page - 1) * pageSize
  Likes.list({ limit, skip })
    .then(likess => res.json(likess))
    .catch(e => next(e));
}


/**
 * Delete likes.
 * @returns {Likes}
 */
function remove(req, res, next) {
  const { refererType, type, referer } = req.body

  if (refererType === 'news') {
    News.updateOne({ _id: referer, likeCount: { $gt: 0 } }, { $inc: { likeCount: -1 } })
      .then(rs => {
        console.log('updateOne rs', rs)
      }, err => {
        console.log('updateOne err', err)
      })
  }

  if (refererType === 'comment') {
    let incOpt = { likeCount: -1 }
    if (type === 'dislike') {
      incOpt = { dislikeCount: -1 }
    }
    Comment.updateOne({ _id: referer, likeCount: { $gt: 0 } }, { $inc: incOpt })
      .then(rs => {
        console.log('updateOne rs', rs)
      }, err => {
        console.log('updateOne err', err)
      })
  }

  Likes.deleteOne({ _id: req.body._id })
    .then(deletedLikes => res.json({
      rs: 1,
      msg: 'success',
      referer: referer,
      type,
    }))
    .catch(e => next(e));
}

module.exports = { load, get, create, update, list, remove };
