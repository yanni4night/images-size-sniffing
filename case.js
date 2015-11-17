/**
 * Copyright (C) 2015 tieba.baidu.com
 * case.js
 *
 * changelog
 * 2015-11-17[11:16:59]:revised
 *
 * @author yinyong02@baidu.com
 * @version 0.1.0
 * @since 0.1.0
 */
var iss = require('./');

var async = require('async');

var humanFormat = require('human-format');

/*var keys = ["萌萌哒天团官方", "peg组合", "百度贴吧粉丝节", "百度贴吧粉丝节官方", "lunar少女组合官方", "炒饭王妃", "uniq官方", "1931女子偶像组合官方", "李易峰官方",
    "陈伟霆官方", "范冰冰官方", "黄晓明官方", "snh48官方", "tfboys官方"
];*/

var keys = ["省呗", "肝炎", "马上理财", "优胜教育", "航海王强者之路", "超神战记", "东旭集团", "城城理财", "在家点点", "刷刷手环", "捕鱼达人千炮版", "仙语", "云在指尖",
    "剑侠情缘移动版", "剑侠移动版", "剑侠情缘手游", "剑侠情缘手机版", "少年三国志", "天子手游", "熹妃传"
];

/*var keys = ["茌平", "故城", "阳谷", "勉县", "单县", "沈丘", "微山", "建湖", "西塘", "临西", "唐河", "东营", "孤岛", "大同", "遵化", "深州",
    "曲阜", "临清"
];*/
var tasks = keys.map(function (key) {
    return function (cb) {
        console.log('Fetching...',key);
        iss.count('http://fes1.tieba.baidu.com/f?kw=' + encodeURIComponent(key), cb, function () {
            return window.$('img[original]').map(function (idx, img) {
                return $(img).attr('original');
            });
        });
    };
});

async.series(tasks, function (err, data) {
    if (!err) {
        var total = data.reduce(function (prev, next) {
            return prev + next;
        });
        console.log(total, humanFormat(total));
    } else {
        console.error(err);
    }
});