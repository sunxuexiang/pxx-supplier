var fs = require('fs');
var path = require('path');
const envTmp = process.argv[2];

const copyFile = (type) => {
  if (type) {
    fs.writeFileSync(
      path.resolve(__dirname, 'config.ts'),
      fs.readFileSync(path.resolve(__dirname, `config-${type}.ts`))
    );
  }
};

copyFile(envTmp);
