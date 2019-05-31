const Promise = require('bluebird');
const mongoose = require('mongoose');
const httpStatus = require('http-status');
const APIError = require('../helpers/APIError');
const User = require('../user/model')
const _ = require('lodash')

/**
 * Comment Schema
 * status: 0:delet, 1:draft, 2:publish
 */
const CommentSchema = new mongoose.Schema({

  content: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    require: true,
  },
  news: {
    type: mongoose.Schema.ObjectId,
    ref: 'News',
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
  dislikeCount: {
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
    ref: 'Comment',
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
CommentSchema.method({
});

/**
 * Statics
 */
CommentSchema.statics = {
  /**
   * Get user
   * @param {ObjectId} id - The objectId of user.
   * @returns {Promise<Comment, APIError>}
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
   * @returns {Promise<Comment[]>}
   */
  list({ skip = 0, limit = 50 } = {}) {
    return this.find({ status: 2 })
      .populate('author')
      .sort({ createdAt: -1 })
      .skip(+skip)
      .limit(+limit)
      .exec()

  },

  /*
   * [
          { replyTo: { $exists: false } },
          { replyTo: { $ne: null } },
        ]
        */
  listByNewsId({ skip = 0, limit = 50, newsId } = {}) {
    console.log('listByNewsId', newsId)
    /*
    return this.find({
        status: 2,
        news: newsId,
      })
      .populate('author')
      .sort({ createdAt: -1 })
      .skip(+skip)
      .limit(+limit)
      .exec()
      */
    return this.aggregate([
      {
        $match: {
          status: 2,
          news: mongoose.Types.ObjectId(newsId)
        }
      },
      { $sort: { createdAt: -1 } },
      { $skip: +skip },
      { $limit: +limit },
      {
        $lookup: {
          from: 'replies',
          localField: '_id',
          foreignField: 'comment',
          as: 'replies'
        }
      },
      {
        $lookup: {
          from: 'users',
          localField: 'author',
          foreignField: '_id',
          as: 'author',
        }
      },
      { $unwind: { path:'$replies', preserveNullAndEmptyArrays: true } },
      { $unwind: { path:'$attachment', preserveNullAndEmptyArrays: true } },
      { $unwind: '$author' },
      {
        $lookup: {
          from: 'users',
          localField: 'replies.author',
          foreignField: '_id',
          as: 'replies.author'
        }
      },
      {
        $lookup: {
          from: 'users',
          localField: 'replies.replyTo',
          foreignField: '_id',
          as: 'replies.replyTo'
        }
      },
      { $unwind: { path: '$replies.replyTo', preserveNullAndEmptyArrays: true } },
      { $unwind: { path: '$replies.author', preserveNullAndEmptyArrays: true } },
      {
        $group: {
          _id: '$_id',
          status:{ $first:'$status' },
          content:{ $first:'$content' },
          author:{ $first:'$author' },
          news:{ $first: '$news' },
          createdAt: { $first: '$createdAt' },
          updatedAt: { $first: '$updatedAt' },
          replies: { $push:'$replies' },
          attachment:{ $push:'$attachment' },
          likeCount: { $first: '$likeCount' },
          dislikeCount: { $first: '$dislikeCount' },
        }
      },
      { $sort: { createdAt: -1 } },
    ])

  }
};

/**
 * @typedef Comment
 */
module.exports = mongoose.model('Comment', CommentSchema);
