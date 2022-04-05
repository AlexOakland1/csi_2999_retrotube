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

const executeSQL = (sql, callback) => {
  let connection = new Connection(config);
  connection.connect((err) => {
    if (err)
      return callback(err, null);
    const request = new Request(sql, (err, rowCount, rows) => {
      connection.close();
      if (err)
        return callback(err, null);
      callback(null, {rowCount, rows});
    });
    connection.execSql(request);
  });
};

executeSQL("SELECT * FROM video", (err, {rowCount, rows}) => {
  if (err)
    console.error(err);
  console.log(rowCount);
  console.log(rows);
  var titles = [];
request.on("row", columns => {
  columns.forEach(column => {
    console.log("%s\t%s", column.metadata.colName, column.value);
    titles.push(column.value);
    console.log(titles);
  });
});

console.log(titles);
});

//const connection = new Connection(config);

// connection.on("connect", err => {
//   if (err) {
//     console.error(err.message);
//     console.log("aaaa");
//   } else {
//     console.log("it working :)");
//   }
// });

// connection.connect();

//max filesize is 1gb
const maxSize = 1000 * 1000 * 1000;

var multer = require('multer');
var storage = multer.diskStorage({
  destination: (req,file,cb) =>{
    cb(null, './public/videos');
  },
  filename: (req, file, cb) => {
    var {originalname} = file;
    cb(null, Date.now() + '-' + originalname);
  }
});
var upload = multer({
  storage: storage,
  limits: { fileSize: maxSize }
});

//var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
const { title } = require('process');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use("/public", express.static(__dirname + "/public"));

function consoleLog() {
  console.log("another test");
}

function renderHome(req, res) {const request = new Request(
  `SELECT vid_name FROM video`,
  (err, rowCount) => {
    if (err) {
      console.error(err.message);
    } else {
      console.log(`${rowCount} row(s) returned`);
      res.render("index", {data: titles});
    }
  }
);
var titles = [];
request.on("row", columns => {
  columns.forEach(column => {
    console.log("%s\t%s", column.metadata.colName, column.value);
    titles.push(column.value);
    console.log(titles);
  });
});

console.log(titles);
connection.execSql(request);
//res.render("index", {data: titles});
consoleLog();}

app.get("/", (req, res) => {
  renderHome(req, res);
});

app.get("/player", (req, res) => {
  res.render("player");
});

app.get("/upload", (req, res) => {
  console.log("test");
  consoleLog();
  res.render("upload", {error: 0});
});

//database connection test
var request = require('tedious').Request  
var TYPES = require('tedious').TYPES;  

//upload file api
app.post("/uploadthis", upload.single('UploadVideo'), (req, res) => {
  let date_ob = new Date();
  let date = ("0" + date_ob.getDate()).slice(-2);
  let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
  let year = date_ob.getFullYear();
  request = new Request("INSERT INTO video (vid_name, vid_desc, upload_date, file_name) OUTPUT INSERTED.id VALUES (@Name, @Desc, @Date, @Filename);", function(err) {  
    if (err) {  
       console.log(err);}
       res.render("upload", {error: 1});  
   });
   request.addParameter('Name', TYPES.NVarChar, req.body.name);  
   request.addParameter('Desc', TYPES.NVarChar , req.body.vid_desc);  
   request.addParameter('Date', TYPES.Date, year + "-" + month + "-" + date);  
   request.addParameter('Filename', TYPES.NVarChar, Date.now() + '-' + req.file.filename);  
   request.on('row', function(columns) {  
             columns.forEach(function(column) {  
               if (column.value === null) {  
                 console.log('NULL');  
               } else {  
                 console.log("Product id of inserted item is " + column.value);  
               }  
             });  
         });
 
   // Close the connection after the final event emitted by the request, after the callback passes
   request.on("requestCompleted", function (rowCount, more) {
       connection.close();
   });
   connection.execSql(request);  
  return res.json({status: 'OK'});
  renderHome();
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
