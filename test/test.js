/**
 * Copyright (C) 2015 yanni4night.com
 * test.js
 *
 * changelog
 * 2015-11-17[00:18:43]:revised
 *
 * @author yanni4night@gmail.com
 * @version 0.1.0
 * @since 0.1.0
 */
var assert = require('assert');

var count = require('../').count;

describe('images-size-sniffing', function() {
    describe('#count()', function() {
        
        this.timeout(1e4);

        it('should return a number', function(done) {
            count('http://www.baidu.com/', function(err, size) {
                assert.ok('number' === typeof size);
                done();
            });
        });
    });
});