const router = require("express").Router();
const verifyToken = require("../middleware/verifyToken");
const validateObjectId = require("../middleware/validateObjectId");
const authController = require('../controllers/auth.controller')

router.post("/sign-up", authController.signUp );

router.post("/sign-in",  authController.signIn);

router.get("/me", verifyToken, authController.verifyUser);

router.get("/user/:id", verifyToken, validateObjectId, authController.getUserById);

router.post("/user/:id", verifyToken, authController.updateUserInfo);

router.post("/user/:id/follow", verifyToken, validateObjectId, authController.followUser);

router.post("/user/:id/unfollow", verifyToken, validateObjectId, authController.unfollowUser);

module.exports = router;
