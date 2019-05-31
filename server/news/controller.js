const News = require('./model');
const Comment = require('../comment/model')

/**
 * Load news and append to req.
 */
function load(req, res, next, id) {
  News.get(id)
    .then((news) => {
      req.news = news; // eslint-disable-line no-param-reassign
      return next();
    })
    .catch(e => next(e));
}

/**
 * Get news
 * @returns {News}
 */
function get(req, res, next) {
  let _id = req.params._id || req.query._id
  News.findOne({ _id })
    .populate('author')
    .then(news => res.json(news))
    .catch(e => next(e))
}

/**
 * Create new news
 * @property {string} req.body.newsname - The newsname of news.
 * @property {string} req.body.mobileNumber - The mobileNumber of news.
 * @returns {News}
 */
function create(req, res, next) {
  const news = new News({...req.body});
  news.save()
    .then(savedNews => res.json(savedNews))
    .catch(e => next(e));
}

/**
 * Update existing news
 * @property {string} req.body.newsname - The newsname of news.
 * @property {string} req.body.mobileNumber - The mobileNumber of news.
 * @returns {News}
 */
function update(req, res, next) {
  let user = req.body
  user.updatedAt = Date.now()
  News.updateOne({_id: req.body._id}, user)
    .then(rs => {
      if (rs.ok && rs.nModified > 0) {
      }
      return res.json(user)
    })
    .catch(e => next(e));
}

/**
 * Get news list.
 * @property {number} req.query.skip - Number of newss to be skipped.
 * @property {number} req.query.limit - Limit number of newss to be returned.
 * @returns {News[]}
 */
function list(req, res, next) {
  const { pageSize = 20, page = 1 } = req.query;
  let limit = pageSize
  let skip = (page - 1) * pageSize
  News.list({ limit, skip, user: req.session.user })
    .then(newss => res.json(newss))
    .catch(e => next(e));
}


/**
 * Delete news.
 * @returns {News}
 */
function remove(req, res, next) {
  News.deleteOne({ _id: req.body._id })
    .then(deletedNews => res.json(deletedNews))
    .catch(e => next(e));
}

module.exports = { load, get, create, update, list, remove };
