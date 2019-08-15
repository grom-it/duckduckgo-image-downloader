#!/usr/bin/env node

const { image_search } = require('duckduckgo-images-api');
const commander = require('commander');
const tempy = require('tempy');
const fs = require('fs');
const { execSync } = require('child_process');

function processResults(results, outputPath) {
  console.log("Found %d images...", results.length);
  const urlFile = writeUrlsToFile(results);
  download(urlFile, outputPath);
  fs.unlinkSync(urlFile);
}

function writeUrlsToFile(results) {
  const tmpfilePath = tempy.file({ extension: 'url' });
  const tmpFile = fs.openSync(tmpfilePath, 'w');
  results.forEach(r => fs.appendFileSync(tmpFile, encodeURI(r.image) + '\n'));

  return tmpfilePath;
}

function download(urlFile, outputPath) {  
  const wgetCommand = '$(which aria2c) -j 10 -i ' + urlFile + ' -d ' + outputPath;
  console.log("Invoking aria2 with: %s", wgetCommand);
  try {
    execSync(wgetCommand, { stdio: 'inherit' });
  } catch (ignore) {
    console.error("download finished with error - some files failed to download");
  }
}

commander
  .arguments('<keywords...>')
  .option('-i, --iterations <number>', 'Number of batches to fetch (each ~50 images)', 1)
  .option('-r, --retries <number>', 'Number of retries', 2)
  .action(function (keywords) {
    console.log('Fetching ~%d images with %d retries for keywords: %s',
      commander.iterations * 50, commander.retries, keywords.join(' '));
    image_search({
      query: keywords.join(' '),
      moderate: false,
      iterations: commander.iterations,
      retries: commander.retries
    }).then(
      results => processResults(results, keywords.join('_'))
    );
  })
  .parse(process.argv);
