/**
 * @description this is necessary for local dev work as there are some fucky wuckies that occur.
 */

const { promises } = require('fs');
const {resolve, relative} = require('path');
const { readdir } = promises;
const { execSync } = require('child_process');

async function setupTables() {
  const files = (await readdir(__dirname)).filter(file => file.endsWith('.json'));
  files.forEach(async file => {
    const abs = resolve(__dirname, file );
    const rel = relative(process.cwd(), abs).replace('\\', '/');
    const output = execSync(`aws dynamodb create-table --cli-input-json file://${rel} --endpoint http://localhost:4000`).toString();
    console.log(output);
  });
}

setupTables();
