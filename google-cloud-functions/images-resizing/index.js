/**
 * Triggered from a change to a Cloud Storage bucket.
 *
 * @param {!Object} event Event payload.
 * @param {!Object} context Metadata for the event.
 */

const { Storage } = require("@google-cloud/storage");
const sharp = require("sharp");
const path = require("path");
const fs = require("fs-extra");
const os = require("os");
const storage = new Storage();
const SIZES = {
  avatar: [32, 120, 194],
};

exports.resizeUploadedImage = async (file, context) => {
  const originalFilePath = file.name;

  if (!originalFilePath.startsWith("pending/")) {
    return false;
  }

  if (!file.contentType.includes("image")) {
    return false;
  }

  const filePath = originalFilePath.replace(/^pending\//, "");
  let [id, type, others] = filePath.split("/");
  const fileFolders = filePath.split("/");
  const fileName = fileFolders.pop();
  const fileFoldersPath = fileFolders.join("/");
  const sizes = SIZES[type];

  if (!sizes) {
    return false;
  }

  const bucket = storage.bucket(file.bucket);
  const tmpDir = path.join(os.tmpdir(), fileFoldersPath);
  const tmpFilePath = path.join(tmpDir, fileName);

  // create tmp dir
  await fs.mkdirs(tmpDir);
  await fs.ensureDir(tmpDir);
  // Download file to temp location
  await bucket.file(originalFilePath).download({ destination: tmpFilePath });

  // It's important!
  sharp.cache(false);

  const resizePromises = sizes.map(async (size) => {
    const [name, expansion] = fileName.split(".");
    const newFileName = `${name}_${size}.${expansion}`;
    const thumbPath = path.join(tmpDir, newFileName);

    await bucket
      .file(thumbPath)
      .delete()
      .catch((e) => {
        console.log("cannot delete old file");
      });

    // console.log("newFileName: ", newFileName);
    // console.log("thumbPath: ", thumbPath);

    let content = await fs.readFile(tmpFilePath, { encoding: "base64" });
    console.log("tmpFile content: ", content);

    // Create thumb image
    await sharp(tmpFilePath)
      .webp({ lossless: true })
      .resize(size, size)
      .toFile(thumbPath);

    content = await fs.readFile(thumbPath, { encoding: "base64" });
    console.log("processed file content: ", content);

    // console.log("old file: ", `${fileFoldersPath}/${newFileName}`);
    // Delete old file
    await bucket
      .file(`${fileFoldersPath}/${newFileName}`)
      .delete()
      .catch((e) => {
        console.log("cannot delete old file");
      });

    // const contents = fs.readFileSync('/path/to/file.jpg', {encoding: 'base64'});

    // Upload thumb image
    await bucket.upload(thumbPath, {
      destination: `${fileFoldersPath}/${newFileName}`,
      metadata: {
        cacheControl: "no-store",
      },
    });

    return true;
  });

  await Promise.all(resizePromises);

  // remove tmp files and original pending file
  await fs.remove(tmpDir);
  await bucket.file(originalFilePath).delete();

  return true;
};
