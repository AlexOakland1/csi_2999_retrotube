var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var { Connection, Request } = require("tedious");

const config = {
  authentication: {
    options: {
      userName: "csi2999group1", // update me
      password: "GqShujLq0fFMYV8A" // update me
    },
    type: "default"
  },
  server: "retrotube-csi2999.database.windows.net", // update me
  options: {
    database: "retrotube", //update me
    encrypt: true
  }
};

const connection = new Connection(config);

connection.on("connect", err => {
  if (err) {
    console.error(err.message);
    console.log("aaaa");
  } else {
    console.log("it working :)");
  }
});

connection.connect();

var multer = require('multer');
var storage = multer.diskStorage({
  destination: (req,file,cb) =>{
    cb(null, './public/videos');
  },
  filename: (req, file, cb) => {
    var {originalname} = file;
    cb(null,originalname);
  }
});
var upload = multer({storage});

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use("/public", express.static(__dirname + "/public"));

app.get("/", (req, res) => {
  res.render("index", {error: 0});
});

app.get("/player", (req, res) => {
  res.render("player");
});

app.get("/upload", (req, res) => {
  res.render("upload");
});

//upload file api
app.post("/uploadthis", upload.single('UploadVideo'), (req, res) => {
  let ts = Date.now();
  let data = { name: 'TEST', vid_desc: 'TEST2', upload_date: ts, file_name:req.file.filename };
  console.log(req.file.filename);
  //console.log(res.req);
  return res.json({status: 'OK'});
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
