const express = require('express');
const router = express.Router();
const { auth } = require('../utils');
const { postController } = require('../controllers');

// middleware that is specific to this router

router.get('/', postController.getAllPosts);
router.post('/', auth(), postController.createPost);
router.get('/:id', postController.getPostById);
router.post('/:postId/comments', auth(), postController.addComment);
router.get('/:postId/comments', postController.getComments);
router.post('/:postId/like', auth(), postController.likePost);
router.get('/latest', postController.getLatestsPosts);
router.put('/:postId', auth(), postController.editPost);
router.delete('/:postId/:themeId', auth(), postController.deletePost);
router.get('/:id/full', postController.getPost);
router.get('/user/:userId', postController.getPostsByUserId);






module.exports = router