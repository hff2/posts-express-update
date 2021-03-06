var express = require('express');
var router = express.Router();
const postsControllers = require('../controllers/posts');
const User = require("../models/users")

router.get('/', postsControllers.getPosts)
router.post('/', postsControllers.createPosts)

router.delete('/', postsControllers.deleteAllPosts)
router.delete('/:id', postsControllers.deleteOnePost)
router.patch('/:id', postsControllers.patchPosts)

module.exports = router;