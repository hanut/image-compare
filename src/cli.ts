import fs from "fs";
import path from "path";

export const APP_VERSION = JSON.parse(
  fs.readFileSync(path.join(__dirname, "..", "package.json")).toString()
)["version"];

export const ERR_CLI_INV_NUM_ARGS =
  "JIT requires the absolute path to the input csv as the first CLI argument";

/**
 * The ReadCLI function processes the command line arguments to the program and returns the
 * path of input csv if it is passed in correctly. If the path is missing, the function throws
 * an error.
 *
 * @returns {string} - the string containing the absolute path to the input csv
 */
const ReadCLI = function ReadCLI(): string {
  if (process.argv.length < 3) {
    throw new Error(ERR_CLI_INV_NUM_ARGS);
  }
  if (process.argv[2] === "version") {
    console.log("John's Tool - Version " + APP_VERSION);
    process.exit(1);
  }
  return process.argv[2];
};

export default ReadCLI;
