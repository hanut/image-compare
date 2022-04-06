import { expect } from "chai";
import "mocha";
import { before } from "mocha";
import path from "path";
import sharp from "sharp";
import { ConvertImages } from "../../src/image";

describe("Image Module", () => {
  describe("ConvertImages()", () => {
    it("should return two image buffers of equal dimensions", (done) => {
      const fp1 = path.join(process.cwd(), "tests", "mock", "images", "ac.jpg");
      const fp2 = path.join(process.cwd(), "tests", "mock", "images", "ac.gif");
      type ImageDimensions = { h: number; w: number };
      let dim1: ImageDimensions, dim2: ImageDimensions;
      sharp(fp1)
        .metadata()
        .then((meta1) => {
          if (!meta1.height || !meta1.width) {
            throw new Error("Test image 1 is of invalid size");
          }
          dim1 = { h: meta1.height || 0, w: meta1.width || 0 };
          sharp(fp2)
            .metadata()
            .then((meta2) => {
              if (!meta1.height || !meta1.width) {
                throw new Error("Test image 2 is of invalid size");
              }
              dim2 = { h: meta2.height || 0, w: meta2.width || 0 };

              ConvertImages(fp1, fp2)
                .then(async (result) => {
                  const md1 = await sharp(result.img1).metadata();
                  const md2 = await sharp(result.img2).metadata();
                  expect(md1.height).to.eq(dim1.h);
                  expect(md1.width).to.eq(dim1.w);
                  expect(md2.height).to.eq(dim2.h);
                  expect(md2.width).to.eq(dim2.w);
                  expect(md1.format).to.eq("png");
                  expect(md2.format).to.eq("png");
                  done();
                })
                .catch(done);
            });
        })
        .catch(done);
    });
  });
});
