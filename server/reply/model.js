const Promise = require('bluebird');
const mongoose = require('mongoose');
const httpStatus = require('http-status');
const APIError = require('../helpers/APIError');
const User = require('../user/model')
const _ = require('lodash')

/**
 * Reply Schema
 * status: 0:delet, 1:draft, 2:publish
 */
const ReplySchema = new mongoose.Schema({

  content: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    require: true,
  },
  comment: {
    type: mongoose.Schema.ObjectId,
    ref: 'Comment',
  },
  status: {
    type: Number,
    default: 1,
  },
  attachment: {
    type: Array,
  },
  author: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true,
  },
  authorInfo: {
    type: Object,
  },
  likeCount: {
    type: Number,
  },
  commentCount: {
    type: Number,
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  },
  replyTo: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
  },
});

/**
 * Add your
 * - pre-save hooks
 * - validations
 * - virtuals
 */

/**
 * Methods
 */
ReplySchema.method({
});

/**
 * Statics
 */
ReplySchema.statics = {
  /**
   * Get user
   * @param {ObjectId} id - The objectId of user.
   * @returns {Promise<Reply, APIError>}
   */
  get(id) {
    return this.findById(id)
      .populate('author')
      .exec()
      .then((user) => {
        if (user) {
          return user;
        }
        const err = new APIError('No such user exists!', httpStatus.NOT_FOUND);
        return Promise.reject(err);
      });
  },

  /**
   * List users in descending order of 'createdAt' timestamp.
   * @param {number} skip - Number of users to be skipped.
   * @param {number} limit - Limit number of users to be returned.
   * @returns {Promise<Reply[]>}
   */
  list({ skip = 0, limit = 50 } = {}) {
    return this.find({ status: 2 })
      .populate('author')
      .sort({ createdAt: -1 })
      .skip(+skip)
      .limit(+limit)
      .exec()

  },

  listByNewsId({ skip = 0, limit = 50, newsId } = {}) {
    return this.find({ status: 2, news: newsId })
      .populate('author')
      .sort({ createdAt: -1 })
      .skip(+skip)
      .limit(+limit)
      .exec()

  }
};

/**
 * @typedef Reply
 */
module.exports = mongoose.model('Reply', ReplySchema);
