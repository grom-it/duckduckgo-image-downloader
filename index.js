#!/usr/bin/env node

const { image_search } = require('duckduckgo-images-api');
const commander = require('commander');
const tempy = require('tempy');
const fs = require('fs');
const { execSync } = require('child_process');

commander
    .arguments('<keywords...>')
    .option('-i, --iterations <n>', 'Number of iterations for infinite scrolling', parseInt, 1)
    .option('-r, --retries <n>', 'Number of retries', parseInt, 2)
    .action(function(keywords) {
        console.log('Fetching ~%d images with %d retries for keywords: %s',
            commander.iterations * 50, commander.retries, keywords.join(' '));
        image_search({ 
            query: keywords.join(' '), 
            moderate: false,
            iterations: commander.iterations,
            retries: commander.retries
        }).then(
            results => {
                console.log("Found %d images...", results.length);
                const tmpfilePath = tempy.file({extension: 'url'});
                const tmpFile = fs.openSync(tmpfilePath, 'w');
                //console.log(require('util').inspect(results));
                results.forEach( r => {
                    fs.appendFileSync(tmpFile, encodeURI(r.image) + '\n');
                });
                const outputPath = keywords.join('_');
                const wgetCommand = '/usr/bin/wget -nd -nv -i ' + tmpfilePath + ' -P ' + outputPath;
                console.log("Invoking wget with: %s", wgetCommand);
                execSync(wgetCommand, {stdio: 'inherit'});
                fs.unlinkSync(tmpfilePath);
            }
        );
    })
    .parse(process.argv);
