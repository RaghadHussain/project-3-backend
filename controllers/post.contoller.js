const Post = require('../models/Post')

async function createNewPost(req, res) {
    try {
        const { caption, image, category } = req.body

        const createdPost = await Post.create({
            user: req.user._id,
            caption, image, category
        })

        res.status(201).json(createdPost)
    } catch (e) {
        res.status(500).json({ message: e.message })
    }
}


async function getAllPosts(req, res) {
    try {
        const allPosts = await Post.find().populate('user').sort({ createdAt: -1 })

        res.status(200).json(allPosts)
    } catch (e) {
        res.status(500).json({ message: e.message })
    }
}


async function getPostById(req, res) {
    try {
        const onePost = await Post.findById(req.params.id).populate('user')

        if (!onePost) {
            return res.status(404).json({ message: "Post Not Found" })
        }

        res.status(200).json(onePost)
    } catch (e) {
        res.status(500).json({ message: e.message })
    }
}

async function getUserPosts(req, res) {
    try {
        const userPosts = await Post.find({user: req.user._id}).populate('user').sort({ createdAt: -1 })

        if (userPosts.length === 0) {
            return res.status(404).json({ message: "No Posts Yet" })
        }

        res.status(200).json(userPosts)
    } catch (e) {
        res.status(500).json({ message: e.message })
    }
}


async function updatePostById(req, res) {
    try {
        const { caption, image, category } = req.body

        const updatedPost = await Post.findByIdAndUpdate(req.params.id,
            { caption, image, category },
            { new: true, runValidators: true })

        if (!updatedPost) {
            return res.status(404).json({ message: "Post Not Found" })
        }

        res.status(200).json(updatedPost)
    } catch (e) {
        res.status(500).json({ message: e.message })
    }
}



async function deletePostById(req, res) {
    try {
        const deletedPost = await Post.findByIdAndDelete(req.params.id)

    if (!deletedPost) {
      return res.status(404).json({ message: "Cannot Delete Post" });
    }

    res.status(200).json(deletedPost)
    } catch (e) {
        res.status(500).json({ message: e.message })
    }
}

module.exports = {
    createNewPost,
    getAllPosts,
    getPostById,
    updatePostById,
    deletePostById,
    getUserPosts
}