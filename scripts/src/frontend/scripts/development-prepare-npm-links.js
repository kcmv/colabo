// TBD

var fs = require('fs');
var child_process = require('child_process');
var packaged_puzzles = require('../packaged_puzzles');

Object.keys(packaged_puzzles.npm_packaged_puzzles).forEach(function(puzzle_npm_name) {
    console.log('Linking: %s ', puzzle_npm_name);
    child_process.execSync('npm link %s', puzzle_npm_name);
});
