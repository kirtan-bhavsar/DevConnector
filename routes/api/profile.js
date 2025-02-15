import express from "express";

const router = express.Router();

router.get("/", (req, res) => {
  res.send("Profile Routes");
});

export default router;
