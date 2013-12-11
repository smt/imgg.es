var fs = require('fs');
var gm = require('gm');

var dir = __dirname + '/public/images';
var w = 48;
var h = 48;
var quality = 75;
var subdir = 'thumbs';

/**
 * IMPORTANT: This script uses the gm library, which has imagemagick and
 * graphicsmagick as dependencies. For more info, please refer to
 * https://github.com/aheckmann/gm
 */

// get filenames from images dir
fs.readdir(dir, function (err, files) {
    if (err) throw err;
    files.forEach(function (file, idx) {
        var path = dir + '/' + file;
        fs.stat(path, function (err, stat) {
            if (err) throw err;
            if (!stat.isFile()) return;      // no dirs or whatnot
            if (file[0] === '.') return; // no dotfiles neither

            // remove extension
            var newfile = file.split('.');
            newfile.pop();
            newfile = newfile.join('.') + '@' + w + 'x' + h + '.jpg';
            var newpath = dir + '/' + subdir + '/' + newfile;

            // generate thumbnails with gm, output to thumbs subdir
            gm(path)
                .thumb(w, h, newpath, quality, function (err, stdout, stdin, cmd) {
                    if (err) return console.dir(arguments);
                    console.log(this.outname + " created  ::  " + cmd);
                })
        });
    });
});

