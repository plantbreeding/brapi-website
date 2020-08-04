var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
    var getStartedArr = require('../public/json/get-started-pages.json')
    res.render('getStarted', {
        title: 'Getting Started',
        page: getStartedArr[0],
        pages: getStartedArr,
        nextHref: '/get-started/1',
        nextTitle: getStartedArr[1]['title'],
        prevHref: '',
        prevTitle: ''
    });
});

router.get('/:pageNum', function(req, res, next) {
    var getStartedArr = require('../public/json/get-started-pages.json')

    var pageNum = parseInt(req.params.pageNum)
    if (pageNum >= getStartedArr.length) {
        pageNum = 0
    }

    var nextHref = '/specification'
    var nextTitle = 'BrAPI Specification'
    if (pageNum + 1 < getStartedArr.length) {
        var nextHref = '/get-started/' + (pageNum + 1)
        var nextTitle = getStartedArr[pageNum + 1]['title']
    }

    var prevHref = ''
    var prevTitle = ''
    if (pageNum - 1 >= 0) {
        var prevHref = '/get-started/' + (pageNum - 1)
        var prevTitle = getStartedArr[pageNum - 1]['title']
    }

    res.render('getStarted', {
        title: 'Getting Started',
        page: getStartedArr[pageNum],
        pages: getStartedArr,
        nextHref: nextHref,
        nextTitle: nextTitle,
        prevHref: prevHref,
        prevTitle: prevTitle
    });
});

module.exports = router;