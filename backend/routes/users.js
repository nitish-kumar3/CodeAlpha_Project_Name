const express = require("express");
const router = express.Router();
const User = require("../models/User");
const auth = require("../middleware/auth");

// Follow or unfollow a user
router.post("/:id/follow", auth, async (req, res) => {
  try {
    const target = await User.findById(req.params.id);
    const me = await User.findById(req.user._id);

    if (!target || target._id.equals(me._id)) return res.status(400).send("Invalid operation");

    const index = me.following.indexOf(target._id);
    if (index === -1) {
      me.following.push(target._id);
      target.followers.push(me._id);
    } else {
      me.following.splice(index, 1);
      target.followers = target.followers.filter(f => !f.equals(me._id));
    }

    await me.save();
    await target.save();
    res.json({ following: me.following.length, followers: target.followers.length });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error following/unfollowing user");
  }
});

module.exports = router;
