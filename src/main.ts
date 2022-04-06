
import ReadCli, { ERR_CLI_INV_NUM_ARGS } from "./cli";
import fs from "fs";
import { OutputRow, ReadCSV, WriteCSV } from "./csv";
import { ConvertImages } from "./image";
import compareImages from "resemblejs/compareImages";
import { ComparisonOptions } from "resemblejs";

const CompareOpts: ComparisonOptions = {
  output: {
    errorColor: {
      red: 255,
      green: 0,
      blue: 255,
    },
    errorType: "movement",
    transparency: 0.3,
    largeImageThreshold: 1200,
    useCrossOrigin: false,
  },
  scaleToSameSize: true,
  ignore: "antialiasing",
};

/**
 * The main function of the program that runs all the processing
 */
async function main() {
  const filePath = ReadCli();

  if (!fs.existsSync(filePath)) {
    throw new Error("invalid file path");
  }
  
  const rows = await ReadCSV(filePath);
  let results: OutputRow[] = [];
  let counter = 0;
  for (let row of rows) {
    console.log("Converting row", ++counter);
    const { img1, img2 } = await ConvertImages(row.image1, row.image2);
    console.log("Comparing images...");
    const ts = Date.now();
    const { rawMisMatchPercentage } = await compareImages(
      img1,
      img2,
      CompareOpts
    );
    results.push({
      ...row,
      similar: parseFloat((rawMisMatchPercentage / 100).toFixed(2)),
      elapsed: parseFloat(((Date.now() - ts)/1000).toFixed(2)),
    });
  }
  await WriteCSV(results, filePath);
}

// Call the main function
main().catch((error) => {
  if(error.message === ERR_CLI_INV_NUM_ARGS) {
    console.log(ERR_CLI_INV_NUM_ARGS);
    console.log("Correct usage -");
    console.log("> johnscore <absolute path to input csv file> or version");
    return;
  }
  console.error(error);
});

process.on("uncaughtException", (error) => {
  console.error("Unhandled exception", error);

  process.exit(1);
});
