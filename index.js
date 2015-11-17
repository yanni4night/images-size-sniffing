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

    yield n.on('dom-ready', function () {
        loaded = true;
    }).goto(url);

    while (!loaded) {
        yield n.wait(1e3);
    }

    yield n.evaluate(function () {
        document.body.scrollTop = document.body.scrollHeight;
    });

    // Wait for loading all <img>
    yield n.wait(3e3);

    var images = yield n.evaluate(findImageCb);

    yield n.end();

    return images;
}

function count(imagesSrc) {
    var counter = 0;
    var promises = imagesSrc.map(function (src) {
        return new Promise(function (resolve) {
            // curl -sI http://tb1.bdstatic.com/tb/%E5%9F%83%E8%8F%B2%E5%B0%94%E6%9C%B5%E6%9C%B5.jpg|grep "Content-Length"|awk '{print $2}'
            if (!src) {
                return resolve(0);
            }

            var j = request.jar();
            var cookie = request.cookie(
                'BAIDUID=C3CB4FAD114136B8880A44C435B7738F:FG=1; max-age=31536000; expires=Wed, 16-Nov-16 05:30:12 GMT; domain=.baidu.com; path=/; version=1'
            );
            if (src.indexOf('.baidu.com') !== -1 && src.indexOf('m.tiebaimg.com') === -1) {
                j.setCookie(cookie, src);
            }
            request.get({
                url: src,
                jar: j
            }, function (err, response) {
                if (!err) {
                    // console.log(response.headers);
                    resolve(response.headers['content-length']);
                } else {
                    console.error('ERROR:[%s]', src, err);
                    resolve(0);
                }
            });
        });
    });

    return new Promise(function (resolve, reject) {
        Promise.all(promises).then(function (lenArr) {
            var total = 0;
            for (var i = 0; i < lenArr.length; ++i) {
                total += parseInt(lenArr[i]);
            }
            resolve(total);
        }).catch(function (e) {
            reject(e);
        });
    });
}

exports.count = function (url, callback, options) {
    options = extend({
        filterImagesSrc: function () {
            return Array.prototype.map.call(document.querySelectorAll('img'), function (img) {
                return img.src;
            }).filter(function (src) {
                return src.indexOf('/c.gif') === -1;
            });
        }
    }, options);

    new Promise(function (resolve, reject) {
        vo(getImagesSrc)(url, options.filterImagesSrc, function (err, imagesSrc) {
            if (err) {
                reject(err);
            } else {
                resolve(imagesSrc);
            }
        });
    }).then(function (imagesSrc) {
        return count(imagesSrc);
    }).then(function (size) {
        callback(null, size);
    }).catch(function (e) {
        callback(e);
    });

};