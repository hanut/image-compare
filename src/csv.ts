import * as FormatCSV from "@fast-csv/format";
import * as ParseCSV from "@fast-csv/parse";
import path from "path";

export interface InputRow {
  image1: string;
  image2: string;
}

export interface OutputRow extends InputRow {
  similar: number;
  elapsed: number;
}

/**
 * ReadCSV function reads and parses the CSV file from the given location
 * and returns the results in an array as the resolved argument of a
 * new promise.
 *
 * In case the csv does not match the column specifications of the tool,
 * it will reject with an error mentioning the exact row number and error
 *
 * @param {string} filePath - the path to the input csv
 * @returns {Promise<InputRow[]>}
 */
export function ReadCSV(filePath: string): Promise<InputRow[]> {
  return new Promise((resolve, reject) => {
    let fdata: InputRow[] = [],
      rc = 0;
    ParseCSV.parseFile(filePath, { headers: true })
      .on("error", reject)
      .on("data", (row: InputRow) => {
        rc++;
        const propLen = Object.getOwnPropertyNames(row).length;
        if (propLen > 2) {
          throw new Error(
            "Error reading CSV: Invalid number of columns in csv at row " +
              rc +
              ". Expected 2, got " +
              propLen
          );
        }
        fdata.push(row);
      })
      .on("end", () => {
        resolve(fdata);
      });
  });
}

/**
 * WriteCSV function formats and writes the processed rows into a file
 * at the same location as the input file mentioned in filePath except with
 * "_out" appended to the filename.
 *
 * @param rows - The rows to be written
 * @param filePath - The path of the input file of the program
 * @returns {Promise<void>} - A promise that resolves once the file is written
 */
export function WriteCSV(rows: OutputRow[], filePath: string): Promise<void> {
  const fp = filePath.split(path.sep);
  const fnp = fp[fp.length - 1].split(".");
  fnp[0] += "_out";
  fp[fp.length - 1] = fnp.join(".");
  const outfilePath = fp.join(path.sep);
  return new Promise((resolve, reject) => {
    FormatCSV.writeToPath(outfilePath, rows, {
      headers: true,
    })
      .on("error", reject)
      .on("finish", () => {
        resolve();
      });
  });
}
