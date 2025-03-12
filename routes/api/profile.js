import express, { response } from "express";
import Profile from "../../models/Profile.js";
import User from "../../models/User.js";
import auth from "../../middleware/auth.js";
import { check, validationResult } from "express-validator";
import mongoose from "mongoose";
import axios from "axios";

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
        msg: "Internal Server Error from route file",
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

// @api PUT /api/profile/experience
// @desc add experience to a profile
// @access private
router.put(
  "/experience",
  [
    auth,
    check(
      check("title", "Title is compulsory").not().isEmpty(),
      check("company", "Company is compulsory").not().isEmpty(),
      check("from", "From date is compulsory").not().isEmpty()
    ),
  ],
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const userId = req.user.id;

    const { title, company, location, from, to, current, description } =
      req.body;

    const newExp = {
      title,
      company,
      location,
      from,
      to,
      current,
      description,
    };

    try {
      const profile = await Profile.findOne({ user: userId });

      if (!profile) {
        return res.status(400).json({ msg: "No user found for this id." });
      }

      // this line adds a new experience to the user profile
      profile.experience.unshift(newExp);

      await profile.save();

      res.status(200).json(profile);
    } catch (error) {
      console.log(error);
      return res.status(500).json({ msg: "Internal Server Error" });
    }
  }
);

// @api DELETE /api/profile/experience/:experience_id
// @desc delete experience for a user profile
// @access private
router.delete("/experience/:experience_id", auth, async (req, res) => {
  const userId = req.user.id;

  const profile = await Profile.findOne({ user: userId });

  const experienceId = req.params.experience_id;

  if (!profile) {
    return res.status(400).json({ msg: "No profile found for this suer" });
  }

  if (!experienceId) {
    return res.status(400).json({ msg: "Please provide valid experience Id" });
  }

  try {
    // console.log(profile.experience);

    profile.experience = profile.experience.filter(
      (exp) => exp._id.toString() !== experienceId
    );

    await profile.save();

    res.status(200).json(profile);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Internal Server Error" });
  }
});

// @api PUT /api/profile/education
// @desc add education for a user profile
// @access private
router.put(
  "/education",
  [
    auth,
    check([
      check("school", "School is compulsary").not().isEmpty(),
      check("degree", "Degree is compulsary").not().isEmpty(),
      check("fieldofstudy", "fieldofstudy is compulsary").not().isEmpty(),
      check("from", "From is compulsary").not().isEmpty(),
    ]),
  ],
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.arrary() });
    }

    try {
      const { school, degree, fieldofstudy, from, to, current, description } =
        req.body;

      const newEdu = {
        school,
        degree,
        fieldofstudy,
        from,
        to,
        current,
        description,
      };

      const userId = req.user.id;

      const profile = await Profile.findOne({ user: userId });

      profile.education.unshift(newEdu);

      await profile.save();

      res.status(200).json(profile);
    } catch (error) {
      console.log(error);
      return res.status(500).json({ msg: "Internal Server Error" });
    }
  }
);

// @api DELETE /api/profile/education/:education_id
// @desc delete education for user profile
// @access private
router.delete("/education/:education_id", auth, async (req, res) => {
  const userId = req.user.id;

  if (!userId) {
    return res.status(400).json({ msg: "Please pass a valid UserId" });
  }

  const educationId = req.params.education_id;

  if (!educationId) {
    return res.status(400).json({ msg: "Please pass a valid education Id" });
  }

  if (!mongoose.Types.ObjectId.isValid(educationId)) {
    return res.status(400).json({ msg: "Please pass a valid education Id" });
  }

  try {
    const profile = await Profile.findOne({ user: userId });

    profile.education = profile.education.filter(
      (educationEntry) => educationEntry._id.toString() !== educationId
    );

    await profile.save();

    res.status(200).json(profile);
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Internal Server Error" });
  }
});

// @api GET /api/profile/user/github/:githubusername
// @desc get 5 most recent github repositories using the GITHUB developer APIs
// @access public
router.get("/github/:githubusername", async (req, res) => {
  const githubUserName = req.params.githubusername;

  try {
    const response = await axios.get(
      `https://api.github.com/users/${githubUserName}/repos`,
      {
        params: {
          per_page: 5,
          sort: "created",
          direction: "desc",
        },
        headers: {
          Accept: "application/vnd.github.v3+json",
        },
      }
    );

    // const status = response.status;

    // console.log(status + " this is status");

    // if (status !== 200) {
    //   return res.status(500).json({ msg: "Interanl Server Error" });
    // }

    const repositories = response.data;
    // const repositories = response.data.repositories;

    console.log(response.status + " this is response status code");

    res.status(200).json(repositories);
  } catch (error) {
    if (error.status === 404) {
      return res
        .status(404)
        .json({ msg: "No github profile found for this user" });
    }
    res.status(500).json({ msg: "Internal Server Error" });
  }
});

export default router;
