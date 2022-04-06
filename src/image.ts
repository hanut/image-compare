import { ComparisonOptions } from "resemblejs";
import compareImages from "resemblejs/compareImages";
import sharp from "sharp";

/**
 * ConverImages is a function that takes the path of two input images,
 * decides which image is larger, resizes both images according to the
 * size of the larger image and then returns the two images as png images
 * with metadata from pngjs.
 *
 * @param {string} fp1 - the string filepath of the first image
 * @param {string} fp2 - string filepath of the second image
 * @returns {Promise<{img1: PNGWithMetadata, img2: PNGWithMetadata}>}
 */
export async function ConvertImages(
  fp1: string,
  fp2: string
): Promise<{ img1: Buffer; img2: Buffer }> {
  console.log("File Path 1", fp1)
  console.log("File Path 2", fp2)
  let { width: w1, height: h1 } = await sharp(fp1).metadata();
  let { width: w2, height: h2 } = await sharp(fp2).metadata();
  if (!w1) w1 = 600;
  if (!h1) h1 = 600;
  if (!w2) w2 = 600;
  if (!h2) h2 = 600;

  let buf1: Buffer, buf2: Buffer;

  // Below we figure out which of the two images is bigger
  // and only upscale/resize the smaller sized image to match the
  // larger one. The conversion to png buffer is done async to
  // improve performance.
  const sf = h1 * w1 - h2 * w2;
  if (sf === 0) {
    [buf1, buf2] = await Promise.all([
      sharp(fp1).toFormat("png").toBuffer(),
      sharp(fp2).toFormat("png").toBuffer(),
    ]);
  } else if (sf > 0) {
    [buf1, buf2] = await Promise.all([
      sharp(fp1).toFormat("png").toBuffer(),
      sharp(fp2).resize(w1, h1).toFormat("png").toBuffer(),
    ]);
  } else {
    [buf1, buf2] = await Promise.all([
      sharp(fp1).resize(w2, h2).toFormat("png").toBuffer(),
      sharp(fp2).toFormat("png").toBuffer(),
    ]);
    h1 = h2;
    w1 = w2;
  }

  let res = {
    img1: buf1,
    img2: buf2,
  };
  return res;
}
