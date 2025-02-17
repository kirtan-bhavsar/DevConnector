import express from "express";
import Profile from "../../models/Profile.js";
import User from "../../models/User.js";
import auth from "../../middleware/auth.js";
import { check, validationResult } from "express-validator";
import mongoose from "mongoose";

const router = express.Router();

// @api GET /api/profile/me
// @desc get current user's profile
// @ access private
router.get("/me", auth, async (req, res) => {
  const profile = await Profile.findOne({ user: req.user.id }).populate(
    "user",
    ["name", "avatar"]
  );

  if (!profile) {
    return res.status(400).json({ msg: "There is no profile for this user" });
  }

  res.status(200).json(profile);
});

// @api POST /api/profile
// @desc add/update profile
// @access private
router.post(
  "/",
  [
    auth,
    [
      check("status", "Status is required").not().isEmpty(),
      check("skills", "Skills are required").not().isEmpty(),
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      company,
      website,
      location,
      status,
      skills,
      bio,
      githubusername,
      youtube,
      twitter,
      facebook,
      linkedin,
      instagram,
    } = req.body;

    const profileFields = {};

    profileFields.user = req.user.id;
    if (company) profileFields.company = company;
    if (location) profileFields.location = location;
    if (website) profileFields.website = website;
    if (status) profileFields.status = status;
    if (bio) profileFields.bio = bio;
    if (githubusername) profileFields.githubusername = githubusername;
    // Turns the String, which consists comma seperated values
    if (skills) {
      profileFields.skills = skills.split(",").map((skill) => skill.trim());
    }

    profileFields.social = {};

    if (youtube) profileFields.social.youtube = youtube;
    if (instagram) profileFields.social.instagram = instagram;
    if (twitter) profileFields.social.twitter = twitter;
    if (linkedin) profileFields.social.linkedin = linkedin;
    if (facebook) profileFields.social.facebook = facebook;

    try {
      let profile = await Profile.findOne({ user: req.user.id });

      if (profile) {
        profile = await Profile.findOneAndUpdate(
          { user: req.user.id },
          { $set: profileFields },
          { new: true }
        );

        return res.status(200).json(profile);
      }

      profile = new Profile(profileFields);

      profile.save();

      res.status(200).json(profile);
    } catch (error) {
      return res.status(500).json({
        msg: "Internal Server Error",
      });
    }
  }
);

// @api GET /api/profile
// @desc get all profiles
// @access public
router.get("/", async (req, res) => {
  try {
    const profiles = await Profile.find().populate("user", ["name", "avatar"]);

    if (!profiles) {
      return res.status(400).json({ msg: "No profiles found" });
    }

    res.status(200).json(profiles);
  } catch (error) {
    return res.status(500).json({ msg: "Interanl Server Error" });
  }
});

// @api GET /api/profile/user/:user_id
// @desc get profile by User id
// @access private
router.get("/user/:user_id", auth, async (req, res) => {
  const userId = req.params.user_id;

  // ---> this same is replicated in the catch block by identifying th error kind and returning accordingly.
  // if (!mongoose.Types.ObjectId.isValid(userId)) {
  //   return res
  //     .status(400)
  //     .json({ msg: "No user profile found for this user id." });
  // }

  try {
    const profile = await Profile.findOne({ user: userId }).populate("user", [
      "name",
      "avatar",
    ]);

    if (!profile) {
      return res
        .status(400)
        .json({ msg: "No user profile found for this user id." });
    }

    res.status(200).json(profile);
  } catch (error) {
    console.log(error);
    if ((error.kind = "ObjectId")) {
      return res
        .status(400)
        .json({ msg: "No user profile found for this user id." });
    }
    return res.status(500).json({ msg: "Internal Server" });
  }
});

// @api DELETE /api/profile
// @desc delete user profile,user and posts
// @access private
router.delete("/", auth, async (req, res) => {
  const userId = req.user.id;

  try {
    // delete profile, user and posts

    // Delete Profile
    await Profile.findOneAndDelete({ user: userId });

    // Delete User
    await User.findOneAndDelete({ _id: userId });

    // todo : Delete Posts

    res.status(200).json({ msg: "User deleted successfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).json("Internal Server Error");
  }
});

export default router;
