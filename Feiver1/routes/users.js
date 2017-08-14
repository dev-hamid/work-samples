var express = require('express');
var router = express.Router();
var passport = require('passport');
var User = require('../models/User');
var Post = require('../models/Post');
var Message = require('../models/Message');
var Comment = require('../models/Comment');
var IsLike = require('../models/IsLike');

router.post('/createpost', (req, res) => {
  try {
    let newPost = new Post({
			user: req.body.user,
			content: req.body.content,
			tags: req.body.tags,
			coordinates: req.body.coordinates
		});
    console.log(newPost);
    newPost.save((err, post) => {
      if (err)
        throw err;
      res.send(post);
    });
  } catch (err) {
    res.send(err);
  }
});

router.delete('/post', (req, res) => {
  let stat = {};
  IsLike.remove({
    post: req.body.post
  }, (err, num) => {
    if (err)
      throw err;
    stat.numOfLikes = num;
  });
  Comment.remove({
    post: req.body.post
  }, (err, num) => {
    if (err)
      throw err;
    stat.numOfComments = num;
  });
  Post.findByIdAndRemove(req.body.post, (err, post) => {
    if (err)
      throw err;
    stat.post = post;
    res.send(stat);
  });
});

router.get('/post', (req, res) => {
  Post.find({
    'coordinates': {
      $near: {
        $geometry: {
          type: 'Point',
          coordinates: req.body.coordinates
        },
        $maxDistance: 1000
      }
    }
  }, (err, docs) => {
    if (err)
      throw err;
    res.send(docs);
  });
});

router.put('/post',(req, res) => {
		Post.findByIdAndUpdate(req.body.id, req.body, (err, post) => {
			if (err) throw err;
			if(!post) console.log("no such post");
			res.send(post);
		})
});

router.put('/like', (req, res) => {
  IsLike.findOne({
    post: req.body.post,
    user: req.body.user
  }, (err, like) => {
    if (err)
      throw err;
    if (!like) {
      let islike = new IsLike({post: req.body.post, user: req.body.user});
      islike.save((err) => {
        if (err)
          throw err;
        }
      );
      Post.findByIdAndUpdate(req.body.post, {
        $inc: {
          likesCounter: 1
        }
      }, (err, doc) => {
        if (err)
          throw err;
        res.send({
          likes: doc.likesCounter + 1,
          like: true
        });
      });
    } else {
      IsLike.findByIdAndRemove(like._id, (err) => {
        if (err)
          throw err;
        }
      );
      Post.findByIdAndUpdate(req.body.post, {
        $inc: {
          likesCounter: -1
        }
      }, (err, doc) => {
        if (err)
          throw err;
        res.send({
          likes: doc.likesCounter - 1,
          like: false
        });
      });
    }
  });
});

router.post('/comment', (req, res) => {
  let comment = new Comment({user: req.body.user, post: req.body.post, content: req.body.content});
  comment.save((err, comment) => {
    if (err)
      throw err;
    res.send(comment);
  });
});

router.put('/comment', (req, res) => {
  Comment.findByIdAndUpdate(req.body.id, {
    $set: {
      content: req.body.content
    }
  }, (err, doc) => {
    if (err)
      throw err;
    res.send(doc);
  });
});

router.delete('/comment', (req, res) => {
  Comment.findByIdAndRemove(req.body.id, (err, post) => {
    if (err)
      throw err;
    res.send(post);
  });
});

router.post('/send', (req, res) => {
  let message = new Message({sender: req.body.sender, reciver: req.body.reciver, content: req.body.content});
  message.save((err, msg) => {
    if (err)
      throw err;
    res.send(msg);
  });
});

router.get('/inbox', (req, res) => {
  Message.find({
    $or: {
      send: req.body.send,
      recive: req.body.recive
    }
  }, (err, msgs) => {
    if (err)
      throw err;
    res.send(msgs);
  }).sort({date: 1});
});

router.post('/search', (req, res) => {
  Post.find({
    tags: {
      $in: req.body.tags
    }
  }, (err, posts) => {
    if (err)
      throw err;
    res.send(posts);
  }).sort({date: 1});
});

module.exports = router;
