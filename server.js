var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');
var _ = require('underscore');

var userSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: String,
    following: [{
        type: mongoose.Schema.Types.ObjectId
    }],
    tweets: [{
        tweet: String,
        timestamp: String
    }]
});

var User = mongoose.model('User', userSchema);
mongoose.connect('localhost/empTwitter');

var express = require('express');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var app = express();

app.set('port', process.env.PORT || 3000);
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.listen(app.get('port'), function() {
    console.log('Express server listening on port ' + app.get('port'));
});

app.get('/api/tweets/:id', function(req, res, next) {
    User.findById(req.params.id, function(err, user) {
        var tweets = [];
        var p = new Promise(function(resolve, reject) {
            var resolvedCount = 0;
            for (var i = 0; i < user.following.length; i++) {
                User.findById(user.following[i], function(err, followingUser) {
                    if (err) return next(err);
                    for(var j=0; j<followingUser.tweets.length; j++) {
                        var tweet = followingUser.tweets[j].toObject();
                        tweet.username = followingUser.name;
                        followingUser.tweets[j] = tweet;
                    }
                    tweets = tweets.concat(followingUser.tweets);
                    console.log(tweets);
                    resolvedCount++;
                    console.log(resolvedCount + " i was and length is " + user.following.length);
                    if(resolvedCount == user.following.length) {
                        resolve(tweets);
                    }
                });
            }
        });
        p.then(function () {
            if (err) return next(err);
            console.log("sending response - " + tweets);
            res.send(tweets);
        });
    });
});

app.get('*', function(req, res) {
    res.redirect('/#' + req.originalUrl);
});

app.use(function(err, req, res, next) {
    console.error(err.stack);
    res.send(500, { message: err.message });
});