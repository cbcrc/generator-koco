'use strict';

var path = require('path');

var endsWith = function(text, suffix) {
    return text.toLowerCase().indexOf(suffix.toLowerCase(), text.length - suffix.length) !== -1;
};

var contains = function(text, otherText) {
    return text.toLowerCase().indexOf(otherText.toLowerCase()) !== -1;
};

var startsWith = function(text, otherText) {
    return text.toLowerCase().indexOf(otherText.toLowerCase()) === 0;
};

var standardizePath = function(filePath) {
    return filePath.replace(/\\/g, '/').replace(path.resolve('./src').replace(/\\/g, '/') + '/', '');
};

var mustBeBabelified = function(srcFilePath) {
    var relativeSrcFilePath = standardizePath(srcFilePath);

    return relativeSrcFilePath && endsWith(relativeSrcFilePath, '.js') && (
        startsWith(relativeSrcFilePath, 'app/') || startsWith(relativeSrcFilePath, 'components/') ||
        (startsWith(relativeSrcFilePath, 'bower_components/') && contains(relativeSrcFilePath, 'koco-'))
    );
};

module.exports = {
    mustBeBabelified: mustBeBabelified,
    options: {}
};
