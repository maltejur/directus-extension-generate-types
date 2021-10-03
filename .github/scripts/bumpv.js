const fs = require("fs");

if (process.argv.length !== 3)
  throw new Error("Invalid command line arguments");

fs.promises
  .readFile("package.json")
  .then((package) => JSON.parse(package))
  .then((package) => ({
    ...package,
    version: process.argv[2],
  }))
  .then((package) => JSON.stringify(package, null, 2))
  .then((package) => fs.promises.writeFile("package.json", package));
