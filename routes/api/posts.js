import express, { request } from "express";
import { check, validationResult } from "express-validator";
import auth from "../../middleware/auth.js";
import User from "../../models/User.js";
import Post from "../../models/Posts.js";

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

  const post = await Post.findById(postId);

  if (!post) {
    return res.status(400).json({ msg: "No post found for this post id" });
  }

  res.status(200).json(post);
});

export default router;
