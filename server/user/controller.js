const User = require('./model');
const News = require('../news/model')
const Comment = require('../comment/model')
const Reply = require('../reply/model')
const Friend = require('../friend/model')

/**
 * Load user and append to req.
 */
function load(req, res, next, id) {
  User.get(id)
    .then((user) => {
      req.user = user; // eslint-disable-line no-param-reassign
      return next();
    })
    .catch(e => next(e));
}

/**
 * Get user
 * @returns {User}
 */
function get(req, res) {
  return res.json(req.user);
}

/**
 * Create new user
 * @property {string} req.body.username - The username of user.
 * @property {string} req.body.mobileNumber - The mobileNumber of user.
 * @returns {User}
 */
function create(req, res, next) {
  const user = new User({
    username: req.body.username,
    mobileNumber: req.body.mobileNumber,
    email: req.body.email,
    password: req.body.password,
    avartar: req.body.avartar,
  });

  user.save()
    .then(savedUser => {
      req.user = savedUser
      return res.json(savedUser)
    })
    .catch(e => next(e));
}

/**
 * Update existing user
 * @property {string} req.body.username - The username of user.
 * @property {string} req.body.mobileNumber - The mobileNumber of user.
 * @returns {User}
 */
function update(req, res, next) {
  User.updateOne({_id: req.body._id}, req.body)
    .then(savedUser => res.json(savedUser))
    .catch(e => next(e));
}

/**
 * Update password for existing user
 * @property {string} req.body.email- The email of user.
 * @property {string} req.body.password- The password of user.
 * @returns {User}
 */
function resetpwd(req, res, next) {
  User.updateOne({email: req.body.email}, req.body)
    .then(savedUser => res.json(savedUser))
    .catch(e => next(e));
}

/**
 * Get user list.
 * @property {number} req.query.skip - Number of users to be skipped.
 * @property {number} req.query.limit - Limit number of users to be returned.
 * @returns {User[]}
 */
function list(req, res, next) {
  const { limit = 50, skip = 0 } = req.query;
  User.list({ limit, skip })
    .then(users => res.json(users))
    .catch(e => next(e));
}

/**
 * Delete user.
 * @returns {User}
 */
function remove(req, res, next) {
  const user = req.user;
  user.remove()
    .then(deletedUser => res.json(deletedUser))
    .catch(e => next(e));
}

async function profile (req, res, next) {
  let userId = req.params.userId || req.query.userId
  if (!userId) {
    res.status(500).json({ rs: 0 })
  }
  const { user = {} } = req.session
  console.log('user', user._id)
  let userInfo = await User.findOne({ _id: userId }).then(info => info)

  let profile = await Promise.all([
    News.find({ author: userId, type: 'news' }).countDocuments(),
    News.find({ author: userId, type: 'remark' }).countDocuments(),
    Comment.find({ newsAuthor: userId }).countDocuments(),
    Reply.find({ commentAuthor: userId }).countDocuments(),
    Friend.find({ referer: userId}).countDocuments(),
    Friend.findOne({ referer: { $all: [userId, user._id] } })
  ]).then(([newsCount, remarkCount, commentCount, replyCount, friendCount, friends]) => {
    return { newsCount, remarkCount, commentCount, replyCount, friendCount, friends }
  })

  userInfo._doc.newsCount = profile.newsCount
  userInfo._doc.remarkCount = profile.remarkCount
  userInfo._doc.commentCount = profile.commentCount
  userInfo._doc.replyCount = profile.replyCount
  userInfo._doc.friendCount = profile.friendCount
  userInfo._doc.friends = profile.friends
  delete userInfo._doc.password

  res.json(userInfo)
}

module.exports = {
  load,
  get,
  create,
  update,
  list,
  remove,
  resetpwd,
  profile,
};
