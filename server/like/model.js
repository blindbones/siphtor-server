const Promise = require('bluebird');
const mongoose = require('mongoose');
const httpStatus = require('http-status');
const APIError = require('../helpers/APIError');
const User = require('../user/model')
const _ = require('lodash')

/**
 * Likes Schema
 * status: 0:delet, 1:draft, 2:publish
 */
const LikesSchema = new mongoose.Schema({

  author: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true,
  },
  referer: {
    type: mongoose.Schema.ObjectId,
    ref: 'News',
    required: true,
  },
  refererType: {
    type: String,
    required: true,
  },
  type: {
    type: String,
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
LikesSchema.method({
});

/**
 * Statics
 */
LikesSchema.statics = {
  /**
   * Get user
   * @param {ObjectId} id - The objectId of user.
   * @returns {Promise<Likes, APIError>}
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
   * @returns {Promise<Likes[]>}
   */
  list({ skip = 0, limit = 50 } = {}) {
    /*
    return this.find({ status: 2 })
      .populate('author')
      .sort({ createdAt: -1 })
      .skip(+skip)
      .limit(+limit)
      .exec()
      */
    return this.aggregate([
      {
        $match: { status: 2 }
      },
      {
        $lookup: {
          from: 'comments',
          localField: '_id',
          foreignField: 'news',
          as: 'comments',
        }
      },
      {
        $lookup: {
          from: 'users',
          localField: 'author',
          foreignField: '_id',
          as: 'author'
        }
      },
      { $unwind: '$author' },
      { $sort: { createdAt: -1 } },
      { $skip: +skip },
      { $limit: +limit }
    ])

  }
};

/**
  @typedef Likes
 */
module.exports = mongoose.model('Likes', LikesSchema);
