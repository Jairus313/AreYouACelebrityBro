const express = require("express");
const multer = require("multer");
const cors = require("cors");
const fs = require("fs");

const app = express();
app.use(cors());

const upload = multer({ dest: "uploads/" });

app.post(
  "/compare",
  upload.fields([
    { name: "follower", maxCount: 1 },
    { name: "following", maxCount: 1 }
  ]),
  (req, res) => {
    try {
      const followerPath = req.files["follower"][0].path;
      const followingPath = req.files["following"][0].path;

      const followerRaw = fs.readFileSync(followerPath, "utf-8");
      const followingRaw = fs.readFileSync(followingPath, "utf-8");

      const followerData = JSON.parse(followerRaw);
      const followingData = JSON.parse(followingRaw)["relationships_following"];

      const FOLLOWER_LIST = new Set(
        followerData.map((entry) => entry.string_list_data[0].value)
      );

      const FOLLOWING_LIST = new Set(
        followingData.map((entry) => entry.string_list_data[0].value)
      );

      const unfollowers = [...FOLLOWING_LIST].filter(
        (user) => !FOLLOWER_LIST.has(user)
      ).sort();

      const notFollowingBack = [...FOLLOWER_LIST].filter(
        (user) => !FOLLOWING_LIST.has(user)
      ).sort();

      fs.unlinkSync(followerPath);
      fs.unlinkSync(followingPath);

      res.json({
        unfollowers,
        not_following_back: notFollowingBack
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to process files." });
    }
  }
);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
