var express = require('express');
var router = express.Router();

router.get('/', function (req, res, next) {
    var posts = require('../public/json/news.json')
    var postID = req.query.id;
    if (postID) {
        if (postID in posts) {
            res.redirect('/news/' + postID);
        } else {
            next(); // defaults to 404 error path
        }
    } else {
        res.render('news', {
            title: 'News',
            footerEvents: require('./events').getTrailerEvents(),
            showList: true,
            posts: posts
        });
    }
});

router.get('/:id', function (req, res, next) {
    var posts = require('../public/json/news.json')
    var postID = req.params.id;
    if (postID in posts) {
        renderNews(res, posts[postID]);
    } else {
        next(); // defaults to 404 error path
    }
});

function renderNews(res, post) {
    res.render('news', {
        title: 'News',
        footerEvents: require('./events').getTrailerEvents(),
        showList: false,
        post: post,
        twitterTitle: post.title,
        twitterDesc: post.article,
        SEOTitle: post.title,
        SEOArticleJSON: buildSEOArticleJSON(post)
    });
}

function buildSEOArticleJSON(post) {
    var schema = {};
    if (post) {
        schema = {
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            "headline": post.title,
            "image": [
                "https://brapi.org/images/brapi-clover-alpha-700x394.png"
            ],
            "datePublished": post.ISO8601,
            "author": [{
                "@type": "Person",
                "name": post.author,
                "url": "https://orcid.org/0000-0001-7151-4445"
            }]
        }
    }
    return JSON.stringify(schema);
}

module.exports = router;