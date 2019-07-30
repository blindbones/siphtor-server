const Promise = require('bluebird');
const mongoose = require('mongoose');
const httpStatus = require('http-status');
const APIError = require('../helpers/APIError');
const User = require('../user/model')
const Like = require('../like/model')
const _ = require('lodash')

/**
 * News Schema
 * status: 0:delet, 1:draft, 2:publish
 */
const NewsSchema = new mongoose.Schema({
  title: {
    type: String,
  },
  content: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    require: true,
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
NewsSchema.method({
});

/**
 * Statics
 */
NewsSchema.statics = {
  /**
   * Get user
   * @param {ObjectId} id - The objectId of user.
   * @returns {Promise<News, APIError>}
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
   * @returns {Promise<News[]>}
   */
  async list({ skip = 0, limit = 50, user = {} } = {}) {
    /*
    return this.find({ status: 2 })
      .populate('author')
      .sort({ createdAt: -1 })
      .skip(+skip)
      .limit(+limit)
      .exec()
      */
    let newsList = await this.aggregate([
      {
        $match: { status: 2, type: 'news' }
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
    console.log('userId', user._id)

    if (user._id) {
      let prizeList = await Like.find({ author: user._id, refererType: 'news' })
      console.log('prizeList', prizeList)
      if (prizeList.length > 0) {
        _.forEach(newsList, news => {
          _.forEach(prizeList, p => {
            console.log('prized', p.referer.toString(), news._id.toString(), news._id.valueOf() ,p.referer.valueOf())
            if (news._id.toString() === p.referer.toString()) {
              console.log('ok')
              news.prized = true
              news.prizeId = p._id
            }
          })
        })
      }
    }

    return newsList
  }
};

/**
  @typedef News
 */
module.exports = mongoose.model('News', NewsSchema);
