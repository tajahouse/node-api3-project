// code away!
const server = require("./server");
const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`\n *** Server running at http://localhost:${PORT}... *** \n`);
});

module.exports = server;