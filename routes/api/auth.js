import express from "express";
import auth from "../../middleware/auth.js";
import User from "../../models/User.js";
// used to ensure proper data validtion for the requests that are made by the user.
import { check, validationResult } from "express-validator";
// import gravatar from "gravatar";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import config from "config";

const router = express.Router();

// @api GET /api/auth
// @desc get user with the auth token
// @access private
router.get("/", auth, async (req, res) => {
  const userId = req.user.id;

  const user = await User.findById(userId).select("-password");

  res.status(200).json(user);
});

// @api : POST /api/auth
// @desc : Register user
// @access : public
router.post(
  "/",
  [
    check("email", "Please enter a valid email ID").isEmail(),
    check(
      "password",
      "Make sure the password contains atleast 6 characters"
    ).exists(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    // const authUser = await User.findOne({email});

    try {
      // Make sure there is not user with the same credentials

      const userExists = await User.findOne({ email });

      if (!userExists) {
        return res
          .status(400)
          .json({ errors: [{ msg: "Invalid Credentials" }] });
      }

      const matchPassword = await bcrypt.compare(password, userExists.password);
      console.log(password + "   " + userExists.password);

      if (!matchPassword) {
        return res.status(400).json({ msg: "Invalid Password" });
      }

      // return jsonwebtoken

      const payload = {
        user: {
          id: userExists.id,
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
      return res.status(500).json({ msg: "internal server error" });
    }
  }
);

export default router;
