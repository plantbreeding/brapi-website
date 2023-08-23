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
            twitterTitle: posts[postID].title,
            twitterDesc: posts[postID].article,
            SEOArticleJSON: buildSEOArticleJSON(posts[postID])
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

function buildSEOArticleJSON(post){
    var schema = {};
    if(post){
        schema =     {
            "@context": "https://schema.org",
            "@type": "NewsArticle",
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