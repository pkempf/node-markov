/** Command-line tool to generate Markov text. */

const fs = require("fs");
const markov = require("./markov");
const axios = require("axios");
const process = require("process");

function genText(src) {
  let machine = new markov.MarkovMachine(src);
  console.log(machine.makeText());
}

function makeTextFrom(path) {
  fs.readFile(path, "utf8", function callback(err, data) {
    if (err) {
      console.error(`Cannot read file: ${path}: ${err}`);
      process.exit(1);
    } else {
      genText(data);
    }
  });
}

async function makeURLTextFrom(url) {
  let resp;

  try {
    resp = await axios.get(url);
  } catch (err) {
    console.error(`Cannot read URL: ${url}: ${err}`);
    process.exit(1);
  }
  genText(resp.data);
}

let [method, path] = process.argv.slice(2);

if (method === "file") {
  makeTextFrom(path);
} else if (method === "url") {
  makeURLTextFrom(path);
} else {
  console.error(`Unknown method: ${method}`);
  process.exit(1);
}
