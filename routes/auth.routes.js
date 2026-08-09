const router = require("express").Router();
const verifyToken = require("../middleware/verifyToken");
const authController = require('../controllers/auth.controller')

router.post("/sign-up", authController.signUp );

router.post("/sign-in",  authController.signIn);

router.get("/me", verifyToken, authController.verifyUser);

router.get("/user", verifyToken, authController.viewUser);

router.post("/user/:id", verifyToken, authController.updateUserInfo);

module.exports = router;
