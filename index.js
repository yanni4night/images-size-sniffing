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
var extend = require('extend');
var Nightmare = require('nightmare');
var vo = require('vo');


function* getImagesSrc(url, findImageCb) {
  var n = new Nightmare({
    width: 2560,
    height: 1600,
    show: true
  });

  var loaded = false;

  yield n.on('dom-ready', function() {
    loaded = true;
  }).goto(url);

  while (!loaded) {
    yield n.wait(1e3);
  }

  yield n.evaluate(function() {
    document.body.scrollTop = document.body.scrollHeight;
  });

  // Wait for loading all <img>
  yield n.wait(2e3);

  var images = yield n.evaluate(findImageCb);

  yield n.end();

  return images;
}

function count(imagesSrc) {
  var counter = 0;
  var promises = imagesSrc.map(function(src) {
    return new Promise(function(resolve) {
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

  return new Promise(function(resolve, reject) {
    Promise.all(promises).then(function(lenArr) {
      var total = 0;
      for (var i = 0; i < lenArr.length; ++i) {
        total += parseInt(lenArr[i]);
      }
      resolve(total);
    }).catch(function(e) {
      reject(e);
    });
  });
}

exports.count = function(url, callback, options) {
  options = extend({
    filterImagesSrc: function() {
      return Array.prototype.map.call(window.document.images, function(img) {
        return img.src;
      });
    }
  }, options);

  new Promise(function(resolve, reject) {
    vo(getImagesSrc)(url, options.filterImagesSrc, function(err, imagesSrc) {
      if (err) {
        reject(err);
      } else {
        resolve(imagesSrc);
      }
    });
  }).then(function(imagesSrc) {
    return count(imagesSrc);
  }).then(function(size) {
    callback(null, size);
  }).catch(function(e) {
    callback(e);
  });

};