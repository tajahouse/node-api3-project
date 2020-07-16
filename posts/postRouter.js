const express = require("express");
const Post = require("./postDb");
const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const allPosts = await Post.get();
    res.status(200).json(allPosts);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Broke" });
  }
});

router.get("/:id", validatePostId, (req, res) => {
  res.status(200).json(req.post);
});

router.delete("/:id", validatePostId, async (req, res) => {
  try {
    await Post.remove(req.params.id);
    res.status(200).json({ message: "DELETED", post: req.post });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Broke" });
  }
});

router.put("/:id", validatePostId, async (req, res) => {
  try {
    await Post.update(req.params.id, req.body);
    res.status(200).json({ id: Number(req.params.id), ...req.body });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Broke" });
  }
});

// custom middleware

async function validatePostId(req, res, next) {
  const { id } = req.params;

  try {
    const validPost = await Post.getById(id);
    if (validPost === undefined) {
      res.status(400).json({ error: "The post ID does not exist" });
    } else {
      req.post = validPost;
      next();
    }
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ error: "Unable to retrieve the post with the specified ID" });
  }
}

module.exports = router;