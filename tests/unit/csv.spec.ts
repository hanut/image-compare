import "mocha";
import path from "path";
import fs from "fs";
import { expect } from "chai";
import { OutputRow, ReadCSV, WriteCSV } from "../../src/csv";
import * as ParseCSV from "@fast-csv/parse";

describe("CSV Module", () => {
  describe("ReadCSV()", () => {
    it("should throw an error if the read file has an invalid number of columns", (done) => {
      const filePath = path.join(
        process.cwd(),
        "tests",
        "mock",
        "input-invalid.mock.csv"
      );
      ReadCSV(filePath)
        .then(() => {
          done(new Error("Failed to catch invalid file syntax"));
        })
        .catch(() => {
          done();
        });
    });

    it("should return the parsed csv as a json object if the csv is valid", (done) => {
      const filePath = path.join(
        process.cwd(),
        "tests",
        "mock",
        "input-valid.mock.csv"
      );
      ReadCSV(filePath)
        .then((fdata) => {
          expect(Array.isArray(fdata)).to.be.true;
          expect(fdata).to.eql([
            { image1: "aa.png", image2: "ba.png" },
            { image1: "ab.png", image2: "bb.png" },
            { image1: "ac.png", image2: "ac.gif" },
            { image1: "ad.png", image2: "bd.png" },
          ]);
          done();
        })
        .catch(done);
    });
  });

  describe("WriteCSV()", () => {
    it("should write an output file with the expected data", (done) => {
      const inFile = path.join(process.cwd(), "input.csv");
      const outFile = path.join(process.cwd(), "input_out.csv");
      // setup a hook to delete the temporary file after test completes
      after(() => {
        fs.rm(outFile, () => {});
      });
      const outputData: OutputRow[] = [
        { image1: "aa.png", image2: "ba.png", similar: 0, elapsed: 0.006 },
        { image1: "ab.png", image2: "bb.png", similar: 0.23, elapsed: 0.843 },
        { image1: "ac.png", image2: "ac.gif", similar: 0, elapsed: 1.43 },
        { image1: "ad.png", image2: "bd.png", similar: 1, elapsed: 2.32 },
      ];
      WriteCSV(outputData, inFile);
      let data: any[] = [], count = 0;
      ParseCSV.parseFile(outFile, {headers: true})
      .on("error", done)
      .on("data", row => {
        const data: OutputRow = {
          image1: row.image1,
          image2: row.image2,
          similar: parseFloat(row.similar),
          elapsed: parseFloat(row.elapsed),
        }
        expect(data).to.eql(outputData[count]);
        count++;
      }).on("end", () => done());
    });
  });
});
