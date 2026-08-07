const router = require("express").Router()
const verifyToken = require("../middleware/verifyToken")
const saveController = require('../controllers/save.contoller')


router.post('/', verifyToken, saveController.saveNewPost)

router.get('/', verifyToken, saveController.getSavedPosts)

router.get('/:id', verifyToken, saveController.getSavedPostById)

router.delete('/:id', verifyToken, saveController.deletePostFromSaved)


module.exports = router;