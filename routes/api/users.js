import express from "express";
// used to ensure proper data validtion for the requests that are made by the user.
import { check, validationResult } from "express-validator";

const router = express.Router();

// @api : POST /api/users
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
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
    }
    console.log(req.body);
    res.status(200).json({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
    });
  }
);

export default router;
