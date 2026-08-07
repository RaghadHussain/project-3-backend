const Save = require('../models/Save')


async function saveNewPost(req, res) {
    try {
        const savedPost = await Save.create({
            user: req.user._id,
            post: req.body.post
        })
        res.status(201).json(savedPost)
    } catch (e) {
        res.status(500).json({ message: e.message })
    }
}

async function getSavedPosts(req, res) {
    try {
        const savedPosts = await Save.find({ user: req.user._id })
        res.status(200).json(savedPosts)
    } catch (e) {
        res.status(500).json({ message: e.message })
    }
}

async function getSavedPostById(req, res){
    try {
        const savedPost = await Save.findOne({ _id: req.params.id, user: req.user._id })

        if (!savedPost) {
            return res.status(404).json({ message: "Saved Post Not Found" })
        }

        res.status(200).json(savedPost)
    } catch (e) {
        res.status(500).json({ message: e.message })
    }
}

async function deletePostFromSaved(req, res) {
    try {
        const deletedSavedPost = await Save.findOneAndDelete({ _id: req.params.id, user: req.user._id })

        if (!deletedSavedPost) {
            return res.status(404).json({ message: "Saved Post Not Found" })
        }

        res.status(200).json(deletedSavedPost)
    } catch (e) {
        res.status(500).json({ message: e.message })
    }
}


module.exports = {
    saveNewPost,
    getSavedPosts,
    getSavedPostById,
    deletePostFromSaved
}