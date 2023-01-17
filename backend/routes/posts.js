const express = require('express');
const router = express.Router();

const postsController = require('../controllers/posts');
const checAuth = require('../middleware/check-auth');
const extractFile = require('../middleware/file');

router.post('',checAuth, extractFile, postsController.createPosts);

router.put("/:id", checAuth, extractFile, postsController.updatePosts);

router.get('', postsController.getPosts);

router.get('/:id', postsController.getPost)

router.delete('/:id', checAuth, postsController.deletePosts);

module.exports = router;

