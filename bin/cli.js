#!/usr/bin/env node

/**
 * Copyright (C) 2015 yanni4night.com
 * cli.js
 *
 * changelog
 * 2015-11-16[23:47:56]:revised
 *
 * @author yanni4night@gmail.com
 * @version 0.1.0
 * @since 0.1.0
 */
var url = process.argv[2];
var humanFormat = require('human-format');

console.log('Fetching...', url);

require('../').count(url, function (err, size) {
    console.log('Total:%s', humanFormat(size));
});