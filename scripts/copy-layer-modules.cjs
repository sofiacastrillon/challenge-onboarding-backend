const fs = require('fs');
const path = require('path');

const source = path.resolve('layers/common/node_modules');
const destination = path.resolve('dist/layers/common/nodejs/node_modules');

fs.cpSync(source, destination, { recursive: true, force: true });
