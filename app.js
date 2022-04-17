// download nodejs dependencies
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var fs = require('fs');
var thumbler = require('video-thumb');
// var videos = fs.readdirSync('./public/videos');
// console.log(videos);

var multer = require('multer');
// define multer function
var storage = multer.diskStorage({
  destination: (req,file,cb) =>{
    cb(null, './public/videos');
    //put uploaded video files in videos folder
  },
  filename: (req, file, cb) => {
    var {originalname} = file;
    cb(null,originalname);
    //make the name of the video in the folder the same as the uploaded file
  }
});
var upload = multer({storage});

//define routes
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

//ejs middleware
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use("/public", express.static(__dirname + "/public"));

//render index page
app.get("/", (req, res) => {
  //get array of videos from videos folder
  var videos = fs.readdirSync('./public/videos');
  //render index page and pass list of videos
  res.render("index", {videos: videos});
});

app.get("/player", (req, res) => {
  //get array of videos from videos folder
  var videos = fs.readdirSync('./public/videos');
  //render player page and pass list of videos and the file in the url
  res.render("player", {load: req.query.file, videos: videos});
});

app.get("/upload", (req, res) => {
  //render upload page
  res.render("upload");
});

//upload file api
app.post("/uploadthis", upload.single('UploadVideo'), (req, res) => {
  console.log('./public/videos/' + req.file.filename);
  // extract thumbnail from uploaded video, put it in img folder
  thumbler.extract('./public/videos/' + req.file.filename, './public/img/' + req.file.filename + '.png', '00:00:01', '640x360', function(){
    console.log('snapshot saved to ' + './public/img/' + req.file.filename + '.png' + ' (640x360) with a frame at 00:00:01');
  });
  // there has to be a wait otherwise the thumbnails wont load lol
  setTimeout(function(){
    //get array of videos from videos folder
    var videos = fs.readdirSync('./public/videos');
    //render index page and pass list of videos
    res.render("index", {videos: videos});
  },500);
});

// catch 404 and forward to error handler
// app.use(function(req, res, next) {
//  next(createError(404));
// });

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;