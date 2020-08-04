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
            showList: false,
            post: posts[postID]
        });
    } else {
        res.render('news', {
            title: 'News',
            showList: true,
            posts: posts
        });
    }
}

module.exports = router;