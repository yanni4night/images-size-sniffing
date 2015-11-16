/**
 * Copyright (C) 2015 yanni4night.com
 * index.js
 *
 * changelog
 * 2015-11-16[23:47:22]:revised
 *
 * @author yanni4night@gmail.com
 * @version 0.1.0
 * @since 0.1.0
 */

var request = require('request');
var jsdom = require('jsdom');
var extend = require('extend');

exports.count = function(url, callback, options) {
  options = extend({
    filterImagesSrc: function(doc) {
      return Array.prototype.map.call(doc.images, function(img) {
        return img.src;
      });
    }
  }, options);

  jsdom.env(url, function(err, window) {
    if (err) {
      return callback(err);
    }

    var imagesSrc = options.filterImagesSrc(window.document);

    // console.log('Total images:', imagesSrc.length)

    var counter = 0;

    var promises = imagesSrc.map(function(src) {
      return new Promise(function(resolve, reject) {
        // console.log('Heading', ++counter);
        request.head(src, function(err, response) {
          if (!err) {
            resolve(response.headers['content-length']);
          } else {
            console.error(err);
            resolve(0);
          }
        });
      });
    });

    Promise.all(promises).then(function(lenArr) {
      var total = 0;
      for (var i = 0; i < lenArr.length; ++i) {
        total += parseInt(lenArr[i]);
      }
      callback(null, total);
    }).catch(function(e) {
      callback(e);
    });

  });

};