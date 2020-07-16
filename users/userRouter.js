const express = require("express");
const router = express.Router();
const User = require("./userDb");
const Post = require("../posts/postDb");

router.post("/", validateUser, async (req, res) => {
  try {
    const newUser = await User.insert(req.body);
    res.status(201).json(newUser);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Unable to create a new user." });
  }
});

router.post(
  "/:id/posts",
  validatePost,
  validateUserId,
  userIdMatchesParams,
  async (req, res) => {
    try {
      const newPost = await Post.insert(req.body);
      res.status(201).json(newPost);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: "Unable to create a new post" });
    }
  }
);

router.get("/", async (req, res) => {
  try {
    const allUsers = await User.get();
    res.status(200).json(allUsers);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Unable to retrieve a list of users." });
  }
});

router.get("/:id", validateUserId, (req, res) => {
  res.status(200).json(req.user);
});

router.get("/:id/posts", validateUserId, async (req, res) => {
  try {
    const userPosts = await User.getUserPosts(req.user.id);

    if (userPosts.length > 0) {
      res.status(200).json(userPosts);
    } else {
      res.status(400).json({ error: "No posts found for this user." });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      error: "Unable to retrieve a list of posts by the specified user id",
    });
  }
});

router.delete("/:id", validateUserId, async (req, res) => {
  try {
    await User.remove(req.user.id);
    res.status(200).json({ message: "DELETED", user: req.user });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Unable to delete the specified user." });
  }
});

router.put("/:id", validateUserId, validateUser, async (req, res) => {
  try {
    //  No need to return what comes back from this DB call
    await User.update(req.params.id, req.body);

    // Defining a custom response that converts the user id to a number, and passing in the "changes" from req.body
    res.status(201).json({ id: Number(req.params.id), ...req.body });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Unable to update user" });
  }
});

//custom middleware
async function validateUserId(req, res, next) {
  const { id } = req.params;

  try {
    const validUser = await User.getById(id);
    if (validUser === undefined) {
      res.status(400).json({ error: "The specified user ID does not exist." });
    } else {
      req.user = validUser;
      console.log(req.user);
      next();
    }
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ error: "Unable to retrieve the specified user ID." });
  }
}

function validateUser(req, res, next) {
  const userInformation = req.body;
  if (Object.entries(userInformation).length === 0) {
    res.status(400).json({ error: "Missing user data" });
  } else if (!userInformation.name) {
    res.status(400).json({ error: "Missing required name field." });
  } else {
    next();
  }
}

function validatePost(req, res, next) {
  const postBody = req.body;

  if (Object.entries(postBody).length === 0) {
    res.status(400).json({ error: "Missing post data" });
  } else if (!postBody.text) {
    res.status(400).json({ error: "Missing required text field" });
  } else if (!postBody.user_id) {
    res.status(400).json({ error: "Missing required user_id field" });
  } else {
    next();
  }
}

function userIdMatchesParams(req, res, next) {
  //console.log(typeof req.params.id, typeof req.body.user_id);
  if (req.params.id == req.body.user_id) {
    next();
  } else {
    res.status(400).json({ error: "User_id does not match params" });
  }
}

module.exports = router;