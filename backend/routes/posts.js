
const express = require("express");
const Post = require("../models/Post");
const auth = require("../middleware/auth");

module.exports = function(io) {
  const router = express.Router();
const upload = require("../middleware/upload");
const cloudinary = require("../utils/cloudinary");

  router.get("/", auth, async (req, res) => {
    const posts = await Post.find().populate("author", "username").sort({ createdAt: -1 });
    res.json(posts);
  });

  router.post("/", auth, upload.single("image"), async (req, res) => {
  try {
    let imageUrl = "";
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path);
      imageUrl = result.secure_url;
    }

    const post = new Post({
      author: req.user._id,
      content: req.body.content,
      image: imageUrl
    });

    await post.save();
    await post.populate("author", "username");

    res.status(201).json(post);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error creating post");
  }
});
    await post.save();
    io.emit("new_post", post);
    res.status(201).json(post);
  });

  return router;
}



// Add comment to a post
router.post("/:id/comments", auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).send("Post not found");

    post.comments.push({
      user: req.user._id,
      comment: req.body.comment
    });

    await post.save();
    await post.populate("comments.user", "username");

    res.status(201).json(post.comments);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error adding comment");
  }
});



// Like or Unlike a post
router.post("/:id/like", auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).send("Post not found");

    const userId = req.user._id.toString();
    const index = post.likes.indexOf(userId);

    if (index === -1) {
      post.likes.push(userId); // like
    } else {
      post.likes.splice(index, 1); // unlike
    }

    await post.save();
    res.json({ likes: post.likes.length, liked: index === -1 });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error toggling like");
  }
});
