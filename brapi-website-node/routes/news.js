var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
    renderNews(res, req.query.id);
});

router.get('/:id', function(req, res, next) {
    renderNews(res, req.params.id);
});

function renderNews(res, postID) {
    var posts = require('../public/json/news.json')
    if (postID in posts) {
        res.render('news', {
            title: 'News',
            footerEvents: require('./events').getTrailerEvents(),
            showList: false,
            post: posts[postID],
            twitterDesc: posts[postID].article
        });
    } else {
        res.render('news', {
            title: 'News',
            footerEvents: require('./events').getTrailerEvents(),
            showList: true,
            posts: posts
        });
    }
}

module.exports = router;