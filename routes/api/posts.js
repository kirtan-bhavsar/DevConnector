import express, { request } from "express";
import { check, validationResult } from "express-validator";
import auth from "../../middleware/auth.js";
import User from "../../models/User.js";
import Post from "../../models/Posts.js";
import mongoose, { mongo } from "mongoose";

const router = express.Router();

// @api POST /api/posts/
// @desc create a post for user
// @access private
router.post(
  "/",
  [auth, [check("text", "Text is compulsary").not().isEmpty()]],
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const userId = req.user.id;
      const userData = await User.findById(userId);
      const avatar = userData.avatar;
      const name = userData.name;

      if (!userId) {
        return res.status(400).json({ msg: "No user found" });
      }

      const { text } = req.body;

      const postBody = {
        user: userId,
        text,
        name,
        avatar,
      };

      const post = new Post(postBody);

      await post.save();

      res.status(200).json(post);
    } catch (error) {
      console.log(error);
      res.status(500).json({ msg: "Internal Server Error" });
    }
  }
);

// @api GET /api/posts/
// @desc get all posts
// @access private
router.get("/", auth, async (req, res) => {
  const userId = req.user.id;

  if (!userId) {
    return res.status(400).json("Please login to access the posts");
  }

  const posts = await Post.find();

  res.status(200).json(posts);
});

// @api /api/posts/:post_id
// @desc get posts by id
// @access private
router.get("/:post_id", auth, async (req, res) => {
  const userId = req.user.id;

  if (!userId) {
    return res.status(400).json({ msg: "Please login to see the posts" });
  }

  const postId = req.params.post_id;

  if (!postId) {
    return res.status(400).json({ msg: "Please pass a post id" });
  }

  if (!mongoose.Types.ObjectId.isValid(postId)) {
    return res.status(404).json({ msg: "Please pass a valid post Id" });
  }

  const post = await Post.findById(postId);
  if (!post) {
    return res.status(400).json({ msg: "No post found for this post id" });
  }

  res.status(200).json(post);
});

// @api DELETE /api/posts/:post_id
// @desc delete post by post id
// @access private
router.delete("/:post_id", auth, async (req, res) => {
  const userId = req.user.id;

  if (!userId) {
    return res.status(400).json({ msg: "Please login to delete the user id" });
  }

  const postId = req.params.post_id;

  if (!postId) {
    return res.status(400).json({ msg: "Please provide a post id" });
  }

  if (!mongoose.Types.ObjectId.isValid(postId)) {
    return res.status(400).json({ msg: "Please pass a valid post id" });
  }

  const post = await Post.findById(postId);

  if (!post) {
    return res.status(400).json({ msg: "No post found for the given id" });
  }

  try {
    if (post.user.toString() === userId) {
      await Post.findByIdAndDelete(postId);
      res.status(200).json({ msg: "Post deleted successfully" });
    } else {
      return res
        .status(400)
        .json({ msg: "You are not authorized to delete this post" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Internal Server Error" });
  }
});

// @api PUT /api/posts/test-like/:post_id
// @desc api to like/not-like a post
// @access private
router.put("/test-like/:post_id", auth, async (req, res) => {
  const postId = req.params.post_id;

  if (!postId) {
    return res.status(400).json({ msg: "Post id not found" });
  }

  if (!mongoose.Types.ObjectId.isValid(postId)) {
    return res.status(404).json({ msg: "Please pass a valid post id" });
  }

  const user = req.user.id;

  if (!user) {
    return res.status(400).json({ msg: "No user found" });
  }

  if (!mongoose.Types.ObjectId.isValid(user)) {
    return res.status(404).json({ msg: "Please provide a valid user Id" });
  }

  try {
    const post = await Post.findById(postId);

    if (!post) {
      return res.status(400).json({ msg: "No post found for the provided id" });
    }

    const hasLiked = post.likes.some((like) => {
      return like.user.toString() === user;
    });

    if (hasLiked) {
      // this code will be executed if user has liked the post before, which will remove it's entry from the likes array

      post.likes = post.likes.filter((like) => like.user.toString() !== user);

      await post.save();
    } else {
      // this code is to be executed if user has not liked the post earlier, which will add the user to likes array
      post.likes.unshift({ user });
      await post.save();
    }

    res.status(200).json(post);
  } catch (error) {
    console.log(error);
    return res.status(400).json({ msg: "Internal Server Error" });
  }
});

// @api PUT /api/posts/test-like/:post_id
// @desc api to like a post
// @access private
router.put("/like/:post_id", auth, async (req, res) => {
  const postId = req.params.post_id;

  if (!postId) {
    return res.status(400).json({ msg: "Post id not found" });
  }

  if (!mongoose.Types.ObjectId.isValid(postId)) {
    return res.status(404).json({ msg: "Please pass a valid post id" });
  }

  const user = req.user.id;

  if (!user) {
    return res.status(400).json({ msg: "No user found" });
  }

  if (!mongoose.Types.ObjectId.isValid(user)) {
    return res.status(404).json({ msg: "Please provide a valid user Id" });
  }

  try {
    const post = await Post.findById(postId);

    // check if the post has been already liked
    // if (post.likes.filter((like) => like.user.toString() === user).length > 0)
    if (post.likes.some((like) => like.user.toString() === user)) {
      return res.status(400).json({ msg: "The post has been already liked" });
    }

    post.likes.unshift({ user });

    await post.save();

    res.status(200).json(post);
  } catch (error) {
    console.log(error.message);
    res.status(400).json({ msg: "Internal Server Error" });
  }
});

// @api PUT /api/posts/test-unlike/:post_id
// @desc api to unlike a post
// @access private
router.put("/unlike/:post_id", auth, async (req, res) => {
  const postId = req.params.post_id;

  if (!postId) {
    return res.status(400).json({ msg: "Post id not found" });
  }

  if (!mongoose.Types.ObjectId.isValid(postId)) {
    return res.status(404).json({ msg: "Please pass a valid post id" });
  }

  const user = req.user.id;

  if (!user) {
    return res.status(400).json({ msg: "No user found" });
  }

  if (!mongoose.Types.ObjectId.isValid(user)) {
    return res.status(404).json({ msg: "Please provide a valid user Id" });
  }

  try {
    const post = await Post.findById(postId);

    // check if post is not liked by the user and return that the post is not liked, and return the error
    // if (
    //   post.likes.filter((like) => like.user.toString() === user).length === 0
    // )
    if (!post.likes.some((like) => like.user.toString() === user)) {
      return res
        .status(400)
        .json({ msg: "The post has not been liked by the user" });
    }

    const removeIndex = post.likes.findIndex(
      (like) => like.user.toString() === user
    );

    post.likes.splice(removeIndex, 1);

    await post.save();

    res.status(200).json(post);
  } catch (error) {
    console.log(error.message);
    res.status(400).json({ msg: "Internal Server Error" });
  }
});

// @api PUT /api/posts/comments/:post_id
// @desc api to add a post comment
// @access private
router.put("/comments/:post_id", auth, async (req, res) => {
  const postId = req.params.post_id;

  if (!postId) {
    return res.status(400).json({ msg: "Post id not found" });
  }

  if (!mongoose.Types.ObjectId.isValid(postId)) {
    return res.status(404).json({ msg: "Please pass a valid post id" });
  }

  const userId = req.user.id;

  if (!userId) {
    return res.status(400).json({ msg: "No user found" });
  }

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(404).json({ msg: "Please provide a valid user Id" });
  }

  const user = await User.findById(userId);

  if (!user) {
    return res.status(400).json({ msg: "No user found for this id" });
  }

  try {
    const post = await Post.findById(postId);

    if (!post) {
      return res
        .status(400)
        .json({ msg: "No post found for the provided post id" });
    }

    let { text } = req.body;

    text = text.trim();

    if (!text || !text.trim()) {
      return res.status(400).json({ msg: "Comment text cannot be blank" });
    }

    const comment = {
      text,
      user: userId,
      avatar: user.avatar,
    };

    post.comments.unshift(comment);

    await post.save();

    res.status(200).json(post);
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ msg: "Internal Server Error" });
  }
});

// @api DELETE /api/posts/comments/:post_id/:comment_id
// @desc delete a comment by only that user
// @access private
router.delete("/comments/:post_id/:comment_id", auth, async (req, res) => {
  const commentId = req.params.comment_id;

  if (!commentId) {
    return res.status(400).json({ msg: "Post id not found" });
  }

  if (!mongoose.Types.ObjectId.isValid(commentId)) {
    return res.status(404).json({ msg: "Please pass a valid post id" });
  }

  const postId = req.params.post_id;

  if (!postId) {
    return res.status(400).json({ msg: "Post id not found" });
  }

  if (!mongoose.Types.ObjectId.isValid(postId)) {
    return res.status(404).json({ msg: "Please pass a valid post id" });
  }

  const userId = req.user.id;

  if (!userId) {
    return res.status(400).json({ msg: "No user found" });
  }

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(404).json({ msg: "Please provide a valid user Id" });
  }

  try {
    const post = await Post.findById(postId);

    if (!post) {
      return res.status(400).json({ msg: "No post found for the user id" });
    }

    const removeIndex = post.comments.findIndex(
      (comment) => comment._id.toString() === commentId
    );

    if (removeIndex === -1) {
      return res
        .status(400)
        .json({ msg: "No comment found matching the comment Id" });
    }

    if (post.comments[removeIndex].user.toString() === userId) {
      post.comments.splice(removeIndex, 1);
    }

    await post.save();

    res.status(200).json(post);
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ msg: "Internal Server Error" });
  }
});

export default router;
