import express from "express";
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

export default router;
