import express from "express";

const router = express.Router();

router.get("/", (req, res) => {
  res.send("Users Routes");
});

export default router;
