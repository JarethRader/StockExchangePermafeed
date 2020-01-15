const Arweave = require("arweave/node");

module.exports = arweaveInstance = Arweave.init({
  host: "arweave.net",
  protocol: "https"
});
