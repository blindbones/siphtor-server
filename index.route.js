const express = require('express');
const userRoutes = require('./server/user/route');
const authRoutes = require('./server/auth/route');
const newsRoutes = require('./server/news/route')
const commentRoutes = require('./server/comment/route')
const uploadRoutes = require('./server/upload/route')
const replyRoutes = require('./server/reply/route')
const likeRoutes = require('./server/like/route')

const UploadMid = require('./server/helpers/UploadMid')
const router = express.Router(); // eslint-disable-line new-cap

// TODO: use glob to match *.route files

/** GET /health-check - Check service health */
router.get('/health-check', (req, res) =>
  res.send('OK')
);

// mount user routes at /users
router.use('/users', userRoutes);

// mount auth routes at /auth
router.use('/auth', authRoutes);

router.use('/news', newsRoutes)

router.use('/comments', commentRoutes)

router.use('/replies', replyRoutes)

router.use('/uploads', UploadMid, uploadRoutes)

router.use('/likes', likeRoutes)

module.exports = router;
