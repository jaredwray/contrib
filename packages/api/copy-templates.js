// eslint-disable-next-line @typescript-eslint/no-var-requires
const fs = require('fs-extra');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const path = require('path');

async function copyViewsToDist(dir, distDir) {
  await fs.copy(dir, distDir);
}

(async function () {
  await copyViewsToDist(path.resolve(__dirname, 'templates'), path.resolve(__dirname, 'dist/templates'));
})();
