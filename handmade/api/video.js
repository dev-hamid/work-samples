let express = require('express');
let router = express();
let fs = require('fs');
let path = require('path');
let mongoose = require('mongoose');
let Videos = require('../models/Video');
let multer = require('multer');
let storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'videos/');
  },
  filename: (req, file, cb) => {
    cb(null, file.fieldname + '-' + Date.now() + '.mp4');
  }
});
let upload = multer({
  storage: storage
}).single('vid');

router.post('/:id/uploadVid', (req, res) => {
  upload(req, res, (err) => {
    if (err) {
      // An error occurred when uploading
      res.json({
        msg: 'something went wrong..'
      });
    }
    // Everything went fine
    res.json({
      success: true,
      msg: 'uploded successfully'
    });
  });
});

//	Stream the video
router.get('/stream', function(req, res, next) {
  //	1.	Path to the movie to stream
  let file = './videos/'+req.query.Query;
  //	2.	Get meta information from the file. In this case we are interested in its size.
  fs.stat(file, function(err, stats) {
    //	1.	If there was an error reading the file stats we inform the browser of what actual happened
    if (err) {
      //	1.	Check if the file exists
      if (err.code === 'ENOENT') {
        // 	->	404 Error if file not found
        return res.sendStatus(404);
      }
      //	2.	IN any other case, just output the full error
      return next(err);
    }
    //	2.	Save the range the browser is asking for in a clear and	reusable variable
    //		The range tells us what part of the file the browser wants in bytes.
    //		EXAMPLE: bytes=65534-33357823
    let range = req.headers.range;
    //	3.	Make sure the browser ask for a range to be sent.
    if (!range) {
      // 	1.	Create the error
      let err = new Error('Wrong range');
      err.status = 416;
      //	->	Send the error and stop the request.
      return next(err);
    }
    //	4.	Convert the string range in to an array for easy use.
    let positions = range.replace(/bytes=/, '').split('-');
    //	5.	Convert the start value in to an integer
    let start = parseInt(positions[0], 10);
    //	6.	Save the total file size in to a clear variable
    let file_size = stats.size;
    //	7.	IF 		the end parameter is present we convert it in to an integer, the same way we did the start position
    // ELSE 	We use the file_size variable as the last part to be sent.
    let end = positions[1] ? parseInt(positions[1], 10) : file_size - 1;
    //	8.	Calculate the amount of bits will be sent back to the browser.
    let chunksize = (end - start) + 1;
    //	9.	Create the header for the video tag so it knows what is receiving.
    let head = {
      'Content-Range': 'bytes ' + start + '-' + end + '/' + file_size,
      'Accept-Ranges': 'bytes',
      'Content-Length': chunksize,
      'Content-Type': 'video/mp4'
    };
    //	10.	Send the custom header
    res.writeHead(206, head);
    //	11.	Create the createReadStream option object so createReadStream knows how much data it should be read from the file.
    let stream_position = {
      start: start,
      end: end
    };
    //	12.	Create a stream chunk based on what the browser asked us for
    let stream = fs.createReadStream(file, stream_position);
    //	13.	Once the stream is open, we pipe the data through the response object.
    stream.on('open', function() {
      stream.pipe(res);
    });
    //	->	If there was an error while opening a stream we stop the request and display it.
    stream.on('error', function(err) {
      return next(err);
    });
  });
});

router.get('/', (req, res) => {
  try {
    Videos.find((err, videos) => {
      if (err) throw err;
      if (!videos) {
        res.json({
          msg: 'no videos'
        });
      } else {
        res.send(videos);
      }
    });
  } catch (err) {
    console.log(err);
    res.json({
      msg: 'something went wrong..'
    });
  }
});

router.get('/:id/find/:Permalink', (req, res) => {
  try {
    Videos.findOne({
        Permalink: req.params.Permalink
      }, (err, video) => {
        if (err) throw err;
        if (!video) {
          res.json({
            msg: 'no such video'
          });
        } else {
          res.send(video);
        }
      })
      .sort({
        Title: 1
      })
      .skip(parseInt(req.query.Offset))
      .limit(parseInt(req.query.Limit));
  } catch (err) {
    console.log(err);
    res.json({
      msg: 'something went wrong..'
    });
  }
});

router.delete('/:id/delete/:idV', (req, res) => {
  try {
    Videos.findByIdAndRemove(req.params.idV, (err, video) => {
      if (err) throw err;
      if (!video) {
        res.json({
          msg: 'no such video'
        });
      } else {
        res.send(video._id + ': is removed');
      }
    });
  } catch (err) {
    console.log(err);
    res.json({
      msg: 'something went wrong..'
    });
  }
});

router.put('/:id/edit/:Permalink', (req, res) => {
  try {
    Videos.findByIdAndUpdate(req.params.Permalink, req.body, (err, video) => {
      if (err) throw err;
      if (!video) {
        res.json({
          msg: 'no such video'
        });
      } else {
        res.send(video);
      }
    });
  } catch (err) {
    console.log(err);
    res.json({
      msg: 'something went wrong..'
    });
  }
});

router.get('/:id/search', (req, res) => {
  try {
    Videos.find({
        "Title": new RegExp(req.query.Query, 'i')
      }, (err, video) => {
        if (err) throw err;
        if (!video) {
          res.json({
            msg: 'no such video'
          });
        } else {
          res.send(video);
        }
      })
      .sort({
        Title: 1
      })
      .skip(parseInt(req.query.Offset))
      .limit(parseInt(req.query.Limit));
  } catch (err) {
    console.log(err);
    res.json({
      msg: 'something went wrong..'
    });
  }
});

module.exports = router;
