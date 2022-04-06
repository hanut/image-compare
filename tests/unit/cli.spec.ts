import "mocha";
import { expect } from "chai";
import ReadCLI, { ERR_CLI_INV_NUM_ARGS } from "../../src/cli";
import { afterEach, beforeEach } from "mocha";

describe("Cli Module", () => {
  describe("ReadCli()", () => {
    let tmp: string[] = [];
    
    beforeEach(() => {
      tmp = Object.assign([], process.argv);
      process.argv = process.argv.slice(0, 2);
    });

    it("should throw an error if no argument is passed", () => {
      expect(ReadCLI).to.throw(ERR_CLI_INV_NUM_ARGS)
    });
    
    it("should return the entered path as a string", () => {
      const filePath = "/home/john/images/list.csv";
      process.argv.push(filePath)
      const result = ReadCLI();
      expect(result).is.eq(filePath)
    });

    afterEach(() => {
      process.argv = tmp
    });
  });
});
