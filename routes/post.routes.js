const router = require("express").Router()
const verifyToken = require("../middleware/verifyToken")
const upload = require("../middleware/upload")
const postControllr = require('../controllers/post.contoller')



router.post('/', verifyToken, upload.single('image'), postControllr.createNewPost)

router.get('/', postControllr.getAllPosts)

router.get('/userPosts', verifyToken, postControllr.getUserPosts)

router.get('/:id', postControllr.getPostById)

router.put('/:id', verifyToken, upload.single('image'), postControllr.updatePostById)

router.delete('/:id', verifyToken, postControllr.deletePostById)


module.exports = router;