import express from "express";
// used to ensure proper data validtion for the requests that are made by the user.
import { check, validationResult } from "express-validator";
import User from "../../models/User.js";
import gravatar from "gravatar";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import config from "config";

const router = express.Router();

// @api : POST /api/users/register
// @desc : Register user
// @access : public
router.post(
  "/register",
  [
    check("name", "Name is required").not().isEmpty(),
    check("email", "Please enter a valid email ID").isEmail(),
    check(
      "password",
      "Make sure the password contains atleast 6 characters"
    ).isLength({ min: 6 }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password } = req.body;

    try {
      // Make sure there is not user with the same credentials

      const userExists = await User.findOne({ email });

      if (userExists) {
        return res
          .status(400)
          .json({ errors: [{ msg: "User already exists" }] });
      }

      // Use their gravatar
      const avatar = gravatar.url(email, {
        s: "200",
        r: "pg",
        d: "mm",
      });

      const user = new User({
        name,
        email,
        password,
        avatar,
      });

      // Encrypt password

      const salt = await bcrypt.genSalt(10);

      user.password = await bcrypt.hash(password, salt);

      await user.save();

      // return jsonwebtoken

      const payload = {
        user: {
          id: user.id,
        },
      };

      jwt.sign(
        payload,
        config.get("jwtSecret"),
        { expiresIn: 360000 },
        (err, token) => {
          if (err) throw err;
          res.json({ token });
        }
      );
    } catch (error) {
      console.log(error);
      return res.status(500).json({ msg: "internal server error" });
    }
  }
);

export default router;
