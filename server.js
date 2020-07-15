const express = require("express");
const server = express();
const UserRouter = require("./users/userRouter");
const PostRouter = require("./posts/postRouter");

server.use(logger);
server.use(express.json());

server.get("/", (req, res) => {
  res.send(`<h2>Let's write some middleware!</h2>`);
});

server.use("/api/users", UserRouter);
server.use("/api/posts", PostRouter);

function logger(req, res, next) {
  console.log(`${req.method} ${req.originalUrl} at ${new Date().toString()}`);
  next();
}
