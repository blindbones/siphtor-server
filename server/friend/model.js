const Promise = require('bluebird');
const mongoose = require('mongoose');
const httpStatus = require('http-status');
const APIError = require('../helpers/APIError');
const User = require('../user/model')
const _ = require('lodash')

/**
 * Friend Schema
 * status: 0:delet, 1:draft, 2:publish
 */
const FriendSchema = new mongoose.Schema({

  referer: {
    type: [mongoose.Schema.ObjectId],
    ref: 'User',
    required: true,
  },

  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
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
FriendSchema.method({
});

/**
 * Statics
 */
FriendSchema.statics = {
  /**
   * Get user
   * @param {ObjectId} id - The objectId of user.
   * @returns {Promise<Friend, APIError>}
   */
  get(id) {
    return this.find({referer: id})
      .populate('referer')
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
   * @returns {Promise<Friend[]>}
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
 * @typedef Friend
 */
module.exports = mongoose.model('Friend', FriendSchema);
