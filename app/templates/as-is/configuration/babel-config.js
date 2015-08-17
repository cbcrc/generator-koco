'use strict';

var endsWith = function(text, suffix) {
    return text.toLowerCase().indexOf(suffix.toLowerCase(), text.length - suffix.length) !== -1;
};

var contains = function(text, otherText) {
    return text.toLowerCase().indexOf(otherText.toLowerCase()) !== -1;
};

var startsWith = function (text, otherText){
    return text.toLowerCase().indexOf(otherText.toLowerCase()) === 0;
  };

var mustBeBabelified = function(srcFilePath){
    return srcFilePath && endsWith(srcFilePath, '.js') && (
            startsWith(srcFilePath, 'app/') || startsWith(srcFilePath, 'components/') ||
            (startsWith(srcFilePath, 'bower_components/') && contains(srcFilePath, 'koco-'))
        );
};


module.exports = {
  mustBeBabelified: mustBeBabelified
};
